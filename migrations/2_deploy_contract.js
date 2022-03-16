const Tether = artifacts.require('Tether');
const Nicoin = artifacts.require('Nicoin');
const Bank = artifacts.require('Bank');
module.exports = async function(deployer, network, accounts) {
  await deployer.deploy(Tether);
  const tether = await Tether.deployed();

  await deployer.deploy(Nicoin);

  const nic = await Nicoin.deployed();

  await deployer.deploy(Bank,nic.address, tether.address);
  const bank = await Bank.deployed();

  //transfer all nic tokens to bank
  await nic.transfer(bank.address,'1000000000000000000000000');

  //gift 100 tether to the investor
  await tether.transfer(accounts[1],'100000000000000000000',{from:accounts[0]});

};
