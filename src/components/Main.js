import React,{Component} from 'react';
import tether from '../tether.png'
import Airdrop from './Airdrop';
class Main extends Component{
  render(){
    console.log(this.props.tetherBalance);
    return(
      <div id='content' className='mt-3'>
        <table className='table text-muted text-center'>
            <thead>
            <tr style={{color:'white'}}>
              <th scope='col'>Staking Balance</th>
              <th scope='col'>Reward Balance</th>
            </tr>
            </thead>
            <tbody>
              <tr style={{color:'white'}}>
                <td>{window.web3.utils.fromWei(this.props.stakingBalance,'Ether')} USDT</td>
                <td>{window.web3.utils.fromWei(this.props.nicBalance,'Ether')} NICOIN</td>
              </tr>
            </tbody>
        </table>
        <div className="card mb-2" style={{opacity:'.9'}}>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              let amount = this.input.value.toString();
              amount = window.web3.utils.toWei(amount,'Ether');
              this.props.stakeTokens(amount);
            }}
            className='mb-3'>
            <div style={{borderSpacing:'0 1em'}}>
              <label className='float-left' style={{marginLeft:'15px'}}><b>Stake Tokens</b></label>
              <span className='float-right' style={{marginRight:'15px'}}>Balance: {window.web3.utils.fromWei(this.props.tetherBalance,'Ether')} USDT</span>
              <div className="input-group mb-4">
                <input type='text' placeholder='0' required ref={(input)=>{this.input = input}} />
                <div className="input-group-open">
                  <div className="input-group-text">
                    <img src={tether} alt='tether' height="32px" />
                    &nbsp;&nbsp;USDT
                  </div>
                </div>
              </div>
              <button type='submit' className='btn btn-primary btn-block btn-lg'>Stake</button>
            </div>
          </form>
          <button
            onClick={(event)=>{
              event.preventDefault();
              this.props.unstakeTokens();
            }}
            className='btn btn-danger btn-block btn-lg'>Unstake</button>
          <div className="card-body text-center" style={{color:'blue'}}>Airdrop</div>
        </div>
      </div>
    )
  }
}

export default Main;
