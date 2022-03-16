pragma solidity ^0.5.0;
import './Nicoin.sol';
import './Tether.sol';

contract Bank {
  address public owner;
  string public name = 'EL BANCO DESCENTRALIZADO';
  Tether public tether;
  Nicoin public nic;

  address[] public stakers;
  mapping(address => uint) public stakingBalance;
  mapping(address => bool) public hasStaked;
  mapping(address =>bool) public isStaking;
  constructor(Nicoin _nic, Tether _tether) public{
    nic = _nic;
    tether = _tether;
    owner = msg.sender;
  }


  //staking function
  function depositTokens(uint _amount) public{
    //transfer tether tokens to the contract address for staking

    require(_amount > 0, 'Amount cannot be 0 or less');

    tether.transferFrom(msg.sender, address(this), _amount);

    //update staking balance
    stakingBalance[msg.sender] += _amount;

    if(!hasStaked[msg.sender]){
      stakers.push(msg.sender);
    }

    isStaking[msg.sender] = true;
    hasStaked[msg.sender] = true;
  }


  function unstakeTokens() public{
    uint balance = stakingBalance[msg.sender];
    require(balance > 0, 'stake amount cannot be 0 or less');

    tether.transfer(msg.sender,balance);

    stakingBalance[msg.sender] = 0;

    isStaking[msg.sender] = false;
  }
  //issue rewards
  function issueTokens() public {
    //require the owner to issue tokens only

    require(msg.sender == owner,'Only owner can call this');

    for(uint i = 0; i<stakers.length; i++){
      address recipient = stakers[i];
      uint balance = stakingBalance[recipient] / 9;
      if(balance > 0){
        nic.transfer(recipient,balance);
      }
    }
  }


}
