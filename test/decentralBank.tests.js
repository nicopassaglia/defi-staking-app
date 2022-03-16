const Tether = artifacts.require('Tether');
const Nicoin = artifacts.require('Nicoin');
const Bank = artifacts.require('Bank');

require('chai')
.use(require('chai-as-promised'))
.should()

//owner seria accounts[0] y cusomter accounts[1], es una sintaxis mas linda
contract ('Bank',([owner,customer]) => {
  let tether, nicoin,bank;

  let tokens = number => web3.utils.toWei(number,'ether');

  before(async () => {
    tether = await Tether.new();
    nicoin = await Nicoin.new();
    bank = await Bank.new(nicoin.address, tether.address);

    await nicoin.transfer(bank.address,tokens('1000000'));

    await tether.transfer(customer,tokens('100'),{from:owner});
  })
  describe('Mock Tether Deployment',async()=>{
    it('matches name successfully',async () =>{
      const name = await tether.name();
      assert.equal(name,'Mock Tether Token');
    })
  });

  describe('Nicoin Token Deployment',async()=>{
    it('matches name successfully',async() => {
      const name = await nicoin.name();
      assert.equal(name,'Nicoin');
    })
  })

  describe('Bank Deployment',async()=>{
    it('matches name successfully',async() => {
      const name = await bank.name();
      assert.equal(name,'EL BANCO DESCENTRALIZADO');
    });

    it('contract has tokens', async() => {
      let balance = await nicoin.balanceOf(bank.address);
      assert.equal(balance, tokens('1000000'));
    });
  });

  describe('Yield Farming', async() => {
    it('rewards tokens for staking',async()=>{
      let result;

      result = await tether.balanceOf(customer);

      assert.equal(result.toString(),tokens('100'),'customer mock wallet balance before staking');

      await tether.approve(bank.address,tokens('100'),{from:customer});
      await bank.depositTokens(tokens('100'),{from:customer});

      result = await tether.balanceOf(customer);

      assert.equal(result.toString(),tokens('0'),'customer mock wallet balance after staking');

      let bank_balance = await tether.balanceOf(bank.address);

      assert.equal(bank_balance,tokens('100'));

      //is staking
      result = await bank.isStaking(customer);
      assert.equal(result,true,'Check if is staking works');

      //staking balance
      result = await bank.stakingBalance(customer);

      assert.equal(result,tokens('100'),'Check if staking balance is right');

      //issue tokens
      await bank.issueTokens({from:owner});

      //ensure only issue tokens
      await bank.issueTokens({from:customer}).should.be.rejected;

      //unstake tokens
      await bank.unstakeTokens({from:customer});


      //check customer balance
      result = await tether.balanceOf(customer);
      assert.equal(result.toString(),tokens('100'),'customer mock wallet balance after staking');

      //check bank balance
      bank_balance = await tether.balanceOf(bank.address);
      assert.equal(bank_balance,tokens('0'),'Updated balance of bank');

      //check if is staking
      result = await bank.isStaking(customer);
      assert.equal(result,false,'customer is not longer staking');


    });

  });
})
