// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;


contract  VotingPollFactory{

    VotingSystem []  votingsystem;

    function creatingVotingPoll() external returns (VotingSystem newVotingSystem  uint256  length){

        newVotingSystem = new VotingSystem();

        votingsystem.push(newVotingSystem);

        length = votingsystem.length;
        
    }

    function getVotingpolls() external view returns (VotingSystem[] memory){
        return votingsystem;
    }

}