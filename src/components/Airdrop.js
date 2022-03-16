import React,{Component} from 'react';
class Airdrop extends Component{
  constructor(){
    super();

    this.state = {
      time:{},
      seconds:20,
    }
    this.timer = 0;
    this.startTimer = this.startTimer.bind(this);
    this.countDown = this.countDown.bind(this);
  }

  secondsToTime(secs) {
    let hours, seconds, minutes;
    seconds = secs;
    minutes = secs/60;
    hours = Math.floor(secs/3600);

    let divisor_for_minutes =  secs % 3600;

    minutes = Math.floor(divisor_for_minutes / 60);

    let divisor_for_seconds = divisor_for_minutes % 60
    seconds = Math.ceil(divisor_for_seconds);

    let object = {
      'h':hours,
      'm':minutes,
      's':seconds
    };
    return object;
  }

  startTimer(){
    if(this.timer == 0 && this.state.seconds > 0){
      this.timer = setInterval(this.countDown, 1000);
    }
  }

  async countDown(){
    let seconds = this.state.seconds - 1;
    this.setState({time:this.secondsToTime(seconds),seconds:seconds});

    if(seconds == 0){
      // let owner = await this.props.bank.methods.owner().call();
      // console.log(owner.toString());
      // await this.props.bank.methods.issueTokens().call();
      clearInterval(this.timer);
    }
  }

  airdropReleaseTokens(){
    let stakingB = this.props.stakingBalance;
    if(stakingB >= window.web3.utils.fromWei('50','Ether')){
      this.startTimer();
    }
  }


  componentDidMount(){
      let timeLeft = this.secondsToTime(this.state.seconds);
      this.setState({time:timeLeft});
  }

  render(){
    this.airdropReleaseTokens();
    return(
      <div style={{color:'black'}}>
        {this.state.time.m}:{this.state.time.s}
      </div>
    )
  }

}

export default Airdrop;
