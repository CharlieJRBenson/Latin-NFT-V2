import { useState, useEffect } from 'react'
import { nftContractAddress } from '../config.js'
import { ethers } from 'ethers'
import axios from 'axios'

import NFT from '../utils/lnft.json'

declare var window: any


const mint = () => {
	const [mintedNFT, setMintedNFT] = useState(null)
	const [txnHash, setTxnHash] = useState(null)
	const [miningStatus, setMiningStatus] = useState(-1)
	const [loadingState, setLoadingState] = useState(0)
	const [txError, setTxError] = useState(null)
	const [currentAccount, setCurrentAccount] = useState('')
	const [correctNetwork, setCorrectNetwork] = useState(false)

	// Checks if wallet is connected
	const checkIfWalletIsConnected = async () => {
		const { ethereum } = window
		if (ethereum) {
			console.log('Got the ethereum obejct: ', ethereum)
		} else {
			console.log('No Wallet found. Connect Wallet')
		}

		const accounts = await ethereum.request({ method: 'eth_accounts' })

		if (accounts.length !== 0) {
			console.log('Found authorized Account: ', accounts[0])
			setCurrentAccount(accounts[0])
		} else {
			console.log('No authorized account found')
		}
	}

	// Calls Metamask to connect wallet on clicking Connect Wallet button
	const connectWallet = async () => {
		try {
			const { ethereum } = window

			if (!ethereum) {
				console.log('Metamask not detected')
				return
			}
			let chainId = await ethereum.request({ method: 'eth_chainId'})
			console.log('Connected to chain:' + chainId)

			const rinkebyChainId = '0x4'

			if (chainId !== rinkebyChainId) {
				alert('You are not connected to the Rinkeby Testnet!')
				return
			}

			const accounts = await ethereum.request({ method: 'eth_requestAccounts' })

			console.log('Found account', accounts[0])
			setCurrentAccount(accounts[0])
		} catch (error) {
			console.log('Error connecting to metamask', error)
		}
	}

	// Checks if wallet is connected to the correct network
	const checkCorrectNetwork = async () => {
		const { ethereum } = window
		let chainId = await ethereum.request({ method: 'eth_chainId' })
		console.log('Connected to chain:' + chainId)

		const rinkebyChainId = '0x4'

		if (chainId !== rinkebyChainId) {
			setCorrectNetwork(false)
		} else {
			setCorrectNetwork(true)
		}
	}

	useEffect(() => {
		checkIfWalletIsConnected()
		checkCorrectNetwork()
	}, [])

	// Creates transaction to mint NFT on clicking Mint Character button
	const mintCharacter = async () => {
		try {
			const { ethereum } = window

			if (ethereum) {
				const provider = new ethers.providers.Web3Provider(ethereum)
				const signer = provider.getSigner()
				const nftContract = new ethers.Contract(
					nftContractAddress,
					NFT.abi,
					signer
				)

				let nftTx = await nftContract.createlnft()
				console.log('Mining....', nftTx.hash)
				setMiningStatus(0)

				let tx = await nftTx.wait()
				setLoadingState(1)
				console.log('Mined!', tx)
				let event = tx.events[0]
				let value = event.args[2]
				let tokenId = value.toNumber()

				console.log(
					`Mined, see transaction: https://rinkeby.etherscan.io/tx/${nftTx.hash}`
				)
				setTxnHash(nftTx.hash);

				getMintedNFT(tokenId)
			} else {
				console.log("Ethereum object doesn't exist!")
			}
		} catch (error) {
			console.log('Error minting character', error)
			setTxError(error.message)
		}
	}

	// Gets the minted NFT data
	const getMintedNFT = async (tokenId) => {
		try {
			const { ethereum } = window

			if (ethereum) {
				const provider = new ethers.providers.Web3Provider(window.ethereum)
				const signer = provider.getSigner()
				const nftContract = new ethers.Contract(
					nftContractAddress,
					NFT.abi,
					signer
				)

				let tokenUri = await nftContract.tokenURI(tokenId)
				let data = await axios.get(tokenUri)
				let meta = data.data

				setMiningStatus(1)
				setMintedNFT(meta.image)
				console.log("AXIOS DATA " + meta.image)
			} else {
				console.log("Ethereum object doesn't exist!")
			}
		} catch (error) {
			console.log(error)
			setTxError(error.message)
		}
	}

	return (
		<div>
			<header className='flex flex-row'>
				<div className= 'w-1/5 bg-[#2a324b]'><p className='p-[10px]'></p></div>
				<div className= 'w-1/5 bg-[#d81159]'><p className='p-[10px]'></p></div>
				<div className= 'w-1/5 bg-[#bfb1c1]'><p className='p-[10px]'></p></div>
				<div className= 'w-1/5 bg-[#b5bec6]'><p className='p-[10px]'></p></div>
				<div className= 'w-1/5 bg-[#c7dbe6]'><p className='p-[10px]'></p></div>
			</header>	

			<div className='flex flex-col items-center pt-32 bg-gradient-to-r from-[#c7dbe6] to-[#2a324b] text-[#FFFAF1] min-h-screen'>
				
				<section className="overflow-hidden text-gray-700 ">
					<div className="container px-5 py-2 mx-auto lg:pt-12 lg:px-32">
						<div className="flex flex-wrap -m-1 md:-m-2">
						<div className="flex flex-wrap w-1/3">
							<div className="w-full p-1 md:p-2">
							<img alt="gallery" className="block object-cover object-center w-full h-full rounded-lg hover:scale-105 transition duration-500 ease-in-out"
								src="https://openseauserdata.com/files/339f4df581b1fab89e8d8d28a7e58452.svg"/>
							</div>
						</div>
						<div className="flex flex-wrap w-1/3">
							<div className="w-full p-1 md:p-2">
							<img alt="gallery" className="block object-cover object-center w-full h-full rounded-lg hover:scale-105 transition duration-500 ease-in-out"
								src="https://openseauserdata.com/files/37065c7dad06f9c10a90373bb1167775.svg"/>
							</div>
						</div>
						<div className="flex flex-wrap w-1/3">
							<div className="w-full p-1 md:p-2">
							<img alt="gallery" className="block object-cover object-center w-full h-full rounded-lg hover:scale-105 transition duration-500 ease-in-out"
								src="https://openseauserdata.com/files/aa2ceb43f6283ea8b478139322102f8f.svg"/>
							</div>
						</div>
						<div className="flex flex-wrap w-1/3">
							<div className="w-full p-1 md:p-2">
							<img alt="gallery" className="block object-cover object-center w-full h-full rounded-lg hover:scale-105 transition duration-500 ease-in-out"
								src="https://openseauserdata.com/files/952af6dd28f3a490fdc7ab7f716e3171.svg"/>
							</div>
						</div>
						<div className="flex flex-wrap w-1/3">
							<div className="w-full p-1 md:p-2">
							<img alt="gallery" className="block object-cover object-center w-full h-full rounded-lg hover:scale-105 transition duration-500 ease-in-out"
								src="https://openseauserdata.com/files/8057c75d7f6c5b55d1b42d9981051e1e.svg"/>
							</div>
						</div>
						<div className="flex flex-wrap w-1/3">
							<div className="w-full p-1 md:p-2">
							<img alt="gallery" className="block object-cover object-center w-full h-full rounded-lg hover:scale-105 transition duration-500 ease-in-out"
								src="https://openseauserdata.com/files/b8204b70b62d7473150f347dd40da1ea.svg"/>
							</div>
						</div>
						</div>
					</div>
				</section>



				<div className='trasition hover:rotate-180 hover:scale-105 transition duration-500 ease-in-out'>
				</div>
				<h2 className='text-3xl font-bold mb-20 mt-12'>
					Mint your Latin NFT!
				</h2>
				{currentAccount === '' ? (
					<button
					className='text-2xl font-bold py-3 px-12 bg-[#f1c232] rounded-lg mb-10 hover:scale-105 transition duration-500 ease-in-out'
					onClick={connectWallet}
					>
					Connect Wallet
					</button>
					) : correctNetwork ? (
					<button
					className='text-2xl font-bold py-3 px-12 bg-[#786BAD] rounded-lg mb-10 hover:scale-105 transition duration-500 ease-in-out'
					onClick={mintCharacter}
					>
					Mint
					</button>
					) : (
					<div className='flex flex-col justify-center items-center mb-20 font-bold text-2xl gap-y-3'>
					<div>----------------------------------------</div>
					<div>Please connect to the Rinkeby Testnet</div>
					<div>and reload the page</div>
					<div>----------------------------------------</div>
					</div>
				)}
				<div className='text-xl font-semibold mb-20 mt-4'>
					View Collection On
					<br></br>
					
					<a
						href={`https://testnets.opensea.io/collection/latinnft`}
						target='_blank'
					>
						<span className='hover:underline hover:underline-offset-8 '>
							OpenSea
						</span>
					</a>									
					
					<a> / </a>	

					<a
						href={`https://rinkeby.rarible.com/collection/${nftContractAddress}`}
						target='_blank'
					>
						<span className='hover:underline hover:underline-offset-8 '>
							Rarible
						</span>
					</a>				
				</div>
								

				{loadingState === 0 ? (
					miningStatus === 0 ? (
						txError === null ? (
							<div className='flex flex-col justify-center items-center'>
								<div className='text-lg font-bold'>
									Processing your transaction
								</div>

							</div>
						) : (
							<div className='text-lg text-red-600 font-semibold'>{txError}</div>
						)
					) : (
						<div></div>
					)
				) : (
					<div className='flex flex-col justify-center items-center'>
						<div className='font-semibold text-lg text-center mb-4'>
							You Minted This Unique Latin NFT
						</div>
						<img
							src={mintedNFT}
							alt=''
							className='h-60 w-60 rounded-lg shadow-2xl shadow-[#d81159] hover:scale-105 transition duration-500 ease-in-out'
						/>
						
						<a
							href={`https://rinkeby.etherscan.io/tx/${txnHash}`}
							target='_blank'
						>
							<span className='hover:underline hover:underline-offset-8 '>
								Mined, See Transaction
							</span>
						</a>

						<br></br>	
						
					</div>
				)}
			</div>

			<footer className='flex flex-row'>
				<div className= 'w-1/5 bg-[#2a324b]'><p className='p-[10px]'></p></div>
				<div className= 'w-1/5 bg-[#d81159]'><p className='p-[10px]'></p></div>
				<div className= 'w-1/5 bg-[#bfb1c1]'><p className='p-[10px]'></p></div>
				<div className= 'w-1/5 bg-[#b5bec6]'><p className='p-[10px]'></p></div>
				<div className= 'w-1/5 bg-[#c7dbe6]'><p className='p-[10px]'></p></div>
			</footer>
		</div>
	)
}

export default mint