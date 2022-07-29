const { assert } = require('chai');

describe('lnft Contract', async () => {
  let nft;
  let nftContractAddress;
  let tokenId;

	beforeEach('Setup Contract', async () => {
    const lnft = await ethers.getContractFactory('lnft');
    nft = await lnft.deploy();
    await nft.deployed();
    nftContractAddress = await nft.address;
	})

	it('Should have an address', async () => {
    assert.notEqual(nftContractAddress, 0x0);
    assert.notEqual(nftContractAddress, '');
    assert.notEqual(nftContractAddress, null);
    assert.notEqual(nftContractAddress, undefined);
	})

	it('Should have a name', async () => {
		// Returns the name of the token
    const name = await nft.collectionName();

    assert.equal(name, 'LatinNFT_V2');
	})

	it('Should have a symbol', async () => {
		// Returns the symbol of the token
    const symbol = await nft.collectionSymbol();

    assert.equal(symbol, 'LNFT2');
	})

	it('Should be able to mint NFT', async () => {
		// Mints a NFT
    let txn = await nft.createlnft();
    let tx = await txn.wait();

		// tokenID of the minted NFT
    let event = tx.events[0];
    let value = event.args[2];
    tokenId = value.toNumber();

    assert.equal(tokenId, 0);

		// Mints another NFT
    txn = await nft.createlnft();
    tx = await txn.wait();

		// tokenID of the minted NFT
    event = tx.events[0];
    value = event.args[2];
    tokenId = value.toNumber();

    assert.equal(tokenId, 1);
  })
  
  it('Should be able to view total minted', async () => {
		// Returns the symbol of the token
    const total = await nft.getTotalNFTsMintedSoFar();

    assert.isNotNaN(total);
	})
})