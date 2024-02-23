import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";

import { expect, assert } from "chai";
import { ethers } from "hardhat";

describe("VotingPoll", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployVotingPoll() {
    // Contracts are deployed using the first signer/account by default
    const [owner, voter1, account2] = await ethers.getSigners();

    const Voting = await ethers.getContractFactory("VotingSystem");
    const voting = await Voting.deploy();

    return { voting, owner, voter1, account2 };
  }

  describe("voting system ", function () {
    it("should allow creating new poll ", async function () {
      const { voting } = await loadFixture(deployVotingPoll);

      const pollName = "Favorite Programming Language";
      const options = ["Solidity", "TypeScript", "Python"];
      await voting.createPoll(pollName, options);
console.log(".....................................................");

      const pol = await voting.getPoll(0);
console.log(".....................................................");

      expect(pol.name).to.equal(pollName);
console.log(".....................................................");
      expect(pol.options).to.deep.equal(options);
    });

    it("Should allow voting on a poll", async function () {
      const { voting, voter1, owner } = await loadFixture(deployVotingPoll);

      const pollName = "Best Crypto Currency";
      const options = ["Bitcoin", "Ethereum", "Cardano"];
      await voting.createPoll(pollName, options);

      await voting.connect(voter1).vote(0, 1); // Voter1 votes for Ethereum

      const poll = await voting.getPoll(0);
      expect(poll.votes[1]).to.equal(1); // Ethereum should have 1 vote
    });

    it("Should prevent double voting", async function () {
      const { voting, voter1, owner } = await loadFixture(deployVotingPoll);

      const pollName = "Best Pet";
      const options = ["Dog", "Cat", "Bird"];
      await voting.connect(owner).createPoll(pollName, options);

      await voting.connect(voter1).vote(0, 0); // Voter1 votes for Dog

      await expect(voting.connect(voter1).vote(0, 1)).to.be.revertedWith(
        "You have already voted in this poll."
      );
    })
    it("should throw error poll does not exist", async function() {
        const { voting, voter1, owner } = await loadFixture(deployVotingPoll);

        const pollName = "Best Pet";
        const options = ["Dog", "Cat", "Bird"];
        await voting.createPoll(pollName, options);

        await expect( voting.getPoll(3)).to.be.revertedWith("Poll does not exist.");
      });

      it("should revert Invalid  option  index", async function (){
        const {voting } = await loadFixture(deployVotingPoll);
        await voting.createPoll("Best Pet", ["Dog", "Cat", "Bird"]);
        await expect(voting.vote(0, 4)).to.be.revertedWith("Invalid option index.");

      });

     
      it("should revert You have already voted in this poll.", async function () {
        const {voting } = await loadFixture(deployVotingPoll);

        await voting.createPoll("Best Pet", ["Dog", "Cat", "Bird"]);
        await voting.vote(0, 0);
        
        await expect(voting.vote(0, 1)).to.be.revertedWith("You have already voted in this poll.");
      });
        
      });
  });

