title -> A Sample Raffle Contract

author -> Germano Costa - Beskpa
notice -> This code is for creating an Untamperable Decentralized Smart Contract
dev -> This implements Chainlink VRF V2 and Chainlink Keepers

dev -> The "checkUpKeep()" function is the function that the Chainlink Keeper nodes call
they look for the 'upKeepNeeded'to return true.
The following should be true in order to return true: 1. Our time interval should have passed 2. The lottery should have at least 1 player, and have some ETH 3. Our subscription is funded with LINK 4. The lottery should be in an "open" state.

You can find everything clearly described in the files.

Notice -> This code was written running on rinkeby. Therefore, it is deprecated and serves only as study material.

Thanks to Patrick Collins and freeCodeCamp.
