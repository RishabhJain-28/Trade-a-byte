import React from 'react';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import '../assets/css/floating.css';

const Float = () => {
    return (
        <>
        <Fab color="primary" aria-label="add" href="#pop-up" className="float">
            <AddIcon />
        </Fab> 
        
        <div className="pop-up" id="pop-up" >
      <div className="pop-up__content" id="scroll" style={{overflowY : 'scroll'}}>
        <a className="pop-up__close" href="#container">x</a>
        <div className="container" id="rules">
          <h3 style={{textAlign: 'center'}} className="ml9">
            <span className="text-wrapper">
              <span className="letters"><centre><b>RULEBOOK</b></centre></span>
            </span>
          </h3>
          <br/>
          <b>
          2:30 PM- EXPLANATION GUIDE OF EVENT (30 min) - on DISCORD 
          </b>
        <br/>
        <br/>
          -Within this time the rules and instructions would be briefed along with answering the queries.
          <br/>-Every team is supposed to select a teammate who on the behalf of the whole team would play the quiz.
          <br/>-The selected participant is supposed to write his name along with his team name in the “QUIZ REGISTRATION” channel on discord.
          <br/>-Only the selected participant would be provided with the “trade quiz” tag and access to the “trade quiz” channel.
          <br/>
          <br/>
          <b>
          3:00 PM- COMMENCEMENT OF THE EVENT (20 min) -on DISCORD and PORTAL 
          </b>
          <br/>
          <br/>-Every team must be ready with their code editors/compilers.
          <br/>-On Portal - Event commences at 3:00 p.m. with the currency allocation of 10,000 coins to each team on the portal.
          <br/>-Components to be bought would be revealed and the teams can discuss among themselves for 5 minutes.
          <br/>-For the next 15 minutes, MARKET will be opened for teams to stock up their INVENTORY.
          <br/>-In the meantime, all the discussion could be done on DISCORD on their respective team channels. 
          <br/>
          <center>
          <b>
          COOLDOWN - 5 minutes break 
          </b>
          </center>
          <br/>
          <b>
          IN-ROUND PROCEDURE( TOTAL 3 ROUNDS)- 
          </b>
          <br/>
          
          <br/>-Round begins with the release of the question under question section on portal.
          <br/>-During each round, there will be a news flash on Dashboard/Discord which might affect the value of one component. Adhering to the instructions would fetch more points.
          <br/>-The teams can either offer their best deals on text channels on DISCORD , or purchase any component from the MARKET at increased price from grand sale.
          <br/>-The favourable deals can be further continued for negotiation on their respective voice channels on discord.
          <br/>-The finalised deal can now be executed on the portal.
          <br/>-The  trading window on portal will be open for exact 15 minutes.
          <br/>-Further 10 minutes will be allocated to edit the code.
          <br/>-The final code is to be uploaded in a  file with their file name as a specific round number (eg: round1.txt), along with filling the exact number of components used. 
          <br/>-In case of any discrepancies found the team will directly be disqualified.
          <br/>-Successful submission automatically rewards the team with 2000 amount of currency 
          <br/>-Next question will automatically appear when the next round sets off!
          <br/>
          
          <center>
          <b>
          COOLDOWN - 5 minutes break 
          </b>
          </center>
          <br/>
          <b>
          QUIZ (on DISCORD)-5 minute
          </b>
          <br/>
          Team representative has to answer 10 questions of 15 seconds duration each by reacting to the correct option number, fastest finger fetches more points in the quiz.
          Only the first choice in each question will be considered, any changes further made will be treated null and void.
          The leaderboard will appear at the end of each question.
          The top 5 scorers have to write their team name in “TRADE QUIZ” channel to receive a complementary currency worth 500 coins.
          
          <br/>
          <center>
          <b>
          COOLDOWN - 5 minutes break till the more challenging round commences.
          </b>
          </center>
          <br/>
          
          <b>
          HOW TO TRADE ON PORTAL :-
          </b>
          <br/>
          <br/>
        <center>
        ON “TRADING” PAGE
        </center>  
          For execution of the deal,one member from team A has to INITIATE THE TRADE by proceeding with generation of code on the portal.
          Team B has to enter the one-time trading code, along with offerings and receivings of the components or currency of each teams, on SEND TRADE OFFER USING A CODE.
          <br/>
          <br/>
          <center>
          ON “TRADE HISTORY” PAGE
          </center>
          Team A can look into the deal and can accept or reject it.
          An error message might be generated owing to lack of components/currency required for the deal.
          Successful execution of the deal updates INVENTORY of each team.
          <br/>
          
        </div>
      </div>
    </div>
        </>
    )
}

export default Float;
