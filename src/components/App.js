import React,{Component} from 'react';
import './App.css';
import Navbar from './Navbar';
import Web3 from 'web3';
import Tether from '../truffle_abis/Tether.json';
import Nicoin from '../truffle_abis/Nicoin.json';
import Bank from '../truffle_abis/Bank.json';
import Main from './Main.js';
import ParticleSettings from './ParticleSettings';
class App extends Component{
  constructor(props){
    super(props);
    this.state = {
      account:'0x0',
      tether: {},
      nicoin:{},
      bank: {},
      tetherBalance:'0',
      nicBalance: '0',
      stakingBalance: '0',
      loading:true,
    }
  }

  stakeTokens = (amount) => {
    this.setState({loading:true});
    this.state.tether.methods.approve(this.state.bank._address,amount).send({from:this.state.account}).on('transactionHash', (hash)=>{
      this.state.bank.methods.depositTokens(amount).send({from:this.state.account}).on('transactionHash',(hash) =>{
        this.setState({loading:false});
      })
    })

  }

  unstakeTokens = () =>{
    this.setState({loading:true});
    this.state.bank.methods.unstakeTokens().send({from:this.state.account}).on('transactionHash',(hash) =>{
      this.setState({loading:false});
    })
  }

  async loadWeb3(){
    if(window.ethereum){
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    }else if(window.web3){
        window.web3 = new Web3(window.web3.currentProvider)
    }else{
      window.alert('No ethereum browser detected! Check out Metamask');
    }
  }

  async loadBlockchainData(){
    const web3 = window.web3;
    const account = await web3.eth.getAccounts();
    this.setState({account:account[0]});
    const networkId = await web3.eth.net.getId();

    //LOAD TETHER CONTRACT
    const tetherData = await Tether.networks[networkId];
    if(tetherData){
      const tether = new web3.eth.Contract(Tether.abi, tetherData.address);
      this.setState({tether:tether});
      let balance =  tether.methods.balanceOf(this.state.account).call() //probando then, podes poner await y listo
      .then((data)=>{
        this.setState({tetherBalance:data.toString()});
      });

    //  this.setState({tetherBalance:balance.toString()})

    } else{
      window.alert("Error! Tether contract not deployed to the network");
    }
    //LOAD NICOIN TOKEN (REWARD TOKEN)
    const nicoinData = await Nicoin.networks[networkId];
    if(nicoinData){
      const nicoin = new web3.eth.Contract(Nicoin.abi,nicoinData.address);
      this.setState({nicoin:nicoin});
      let nicBalance = await nicoin.methods.balanceOf(this.state.account).call();
      this.setState({nicBalance:nicBalance.toString()});
    }else{
      window.alert("Error! Nicoin contract not deployed to the network");
    }


    //LOAD BANK!
    const bankData = await Bank.networks[networkId];
    if(bankData){
      const bank = new web3.eth.Contract(Bank.abi,bankData.address);
      this.setState({bank:bank});
      let stakingBalance = await bank.methods.stakingBalance(this.state.account).call();
      let bank_name = await bank.methods.name().call();
      console.log(bank_name.toString());
      this.setState({stakingBalance:stakingBalance.toString()});
    }else{
      window.alert("Error! Bank contract not deployed to the network");
    }

    this.setState({loading:false});
  }

  async componentDidMount(){
    await this.loadWeb3();
    await this.loadBlockchainData();
  }
  render(){
    let content;
    {
      this.state.loading ?
      content = <p id='loader' className='text-center' style={{margin:'30px',color:'white'}}>LOADING PLEASE...</p>
      :
      content = <Main
        tetherBalance={this.state.tetherBalance}
        nicBalance = {this.state.nicBalance}
        stakingBalance = {this.state.stakingBalance}
        stakeTokens = {this.stakeTokens}
        unstakeTokens = {this.unstakeTokens}
        bank = {this.state.bank}
        account = {this.state.account}
        />
    }
    return(
      <div className='App' style={{position:'relative'}}>
        <div style={{position:'absolute'}}>
          <ParticleSettings />
        </div>
        <Navbar account={this.state.account} />
        <div className='container-fluid mt-5'>
          <div className='row'>
            <main role='main' className='col-lg-12 ml-auto mr-auto' style={{maxWidth:'600px'}}>
              <div>
                {content}
              </div>
            </main>
          </div>
        </div>
      </div>
    )
  }
}

export default App;
