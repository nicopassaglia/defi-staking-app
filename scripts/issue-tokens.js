const Bank = artifacts.require('Bank');

module.exports = async function issueRewards(callback){
  let bank = await Bank.deployed();
  await bank.issueTokens();
  console.log('Tokens have been issued succesfully');
  callback();
}
