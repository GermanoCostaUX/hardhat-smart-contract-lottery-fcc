const { assert, expect } = require("chai")
const { network, getNamedAccounts, deployments, ethers } = require("hardhat")
const { isCallTrace } = require("hardhat/internal/hardhat-network/stack-traces/message-trace")
const { developmentChains, networkConfig } = require("../../helper-hardhat-config")

developmentChains.includes(network.name)
    ? describe.skip
    : describe("Raffle Unit Tests", function () {
          let raffle, raffleEntranceFee, deployer

          beforeEach(async function () {
              deployer = (await getNamedAccounts()).deployer
              raffle = await ethers.getContract("Raffle", deployer)
              raffleEntranceFee = await raffle.getEntranceFee()
          })

          describe("fulfillRandomWords", () => {
              isCallTrace(
                  "works with live Chainlink Keepers and Chainlink VRF, we get a random winner",
                  async () => {
                      // enter the raffle
                      const startingTimeStamp = await raffle.getLatestTimeStamp()
                      const accounts = await ethers.getSigners()

                      await new Promise(async (resolve, reject) => {
                          // setup listener before we enter the raffle just in case the Blochchain moves too fast
                          raffle.once("WinnerPicked", async () => {
                              console.log("WnnerPicked event fired!!!")

                              try {
                                  // add asserts here
                                  const recentWinner = await raffle.getRecentWinner()
                                  const raffleState = await raffle.getRaffleState()
                                  const winnerEndingBalance = await accounts[0].getBalance()
                                  const endingTimeStamp = await raffle.getLatestTimeStamp()

                                  await expect(raffle.getPlayer(0)).to.be.reverted
                                  assert.equal(recentWinner.toString(), accounts[0].address)
                                  assert.equal(raffleState, 0)
                                  assert.equal(
                                      winnerEndingBalance.toString(),
                                      winnerStartingBalance.add(raffleEntranceFee).toString()
                                  )
                                  assert(endingTimeStamp > startingTimeStamp)
                                  resolve()
                              } catch (error) {
                                  console.log(error)
                                  reject(e)
                              }
                          })
                          // then enterign the raffle
                          await raffle.enterRaffle({ value: raffleEntranceFee })
                          const winnerStartingBalance = await accounts[0].getBalance()

                          // and this code won't complete until our listener has finished listening
                      })
                  }
              )
          })
      })
