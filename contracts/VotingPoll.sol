// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract VotingSystem {
    struct Poll {
        uint id;
        string names;
        string[] options;
        mapping(uint => uint) optionVotes;
        mapping(address => bool) hasVoted;
    }

    struct PollData {
        uint id;
        string name;
        string[] options;
        uint[] votes;
    }

    uint public nextPollId;

    mapping(uint => Poll) public polls;

    mapping(address => mapping(uint => bool)) public userVotes;

    function createPoll(string memory _name, string[] memory _options) public {
        require(msg.sender != address(0), "Get out ");

        Poll storage _poll = polls[nextPollId];

        _poll.id = nextPollId;

        _poll.names = _name;

        for (uint i = 0; i < _options.length; i++) {
            _poll.options.push(_options[i]);
        }
        nextPollId++;
    }

    function vote(uint _pollId, uint _optionIndex) public {

        require(_optionIndex < polls[_pollId].options.length, "Invalid option index.");

        require(!polls[_pollId].hasVoted[msg.sender], "You have already voted in this poll.");

        polls[_pollId].optionVotes[_optionIndex]++;

        polls[_pollId].hasVoted[msg.sender] = true;
    }

    function getPoll(uint _pollId) public view returns (PollData memory) {
        
        require(_pollId < nextPollId, "Poll does not exist.");
        Poll storage p = polls[_pollId];
        uint[] memory votes = new uint[](p.options.length);
        for (uint i = 0; i < p.options.length; i++) {
            votes[i] = p.optionVotes[i];
        }
        
        return PollData(p.id, p.names, p.options, votes);
    }
}
