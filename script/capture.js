const Gsn = require("@opengsn/gsn");
const ethers = require("ethers");
// const Web3 = require("web3-providers-http");
const Web3 = require("web3");

const flagRaw = require("./CaptureTheFlag.json");

const forwarderAddress = "0xE0c15D026b91497F1B5f7645eA8bF85bD50ec3F5"
const naivePaymaster = "0x3DCf84023068BcbA537D1FecA32a0f41A71B87AC"

const run = async () => {
    
    // const provider = new ethers.providers.JsonRpcProvider("https://api.s0.b.hmny.io");
    const provider = new ethers.providers.JsonRpcProvider("http://localhost:8545");
    const mn = "salad fever age erupt kitchen arrange visa double muffin wait income jelly"
    const signer = ethers.Wallet.fromMnemonic(mn).connect(provider)
    const flag = new ethers.ContractFactory(flagRaw.abi,flagRaw.bytecode, signer)
    const flagContract = await flag.deploy(forwarderAddress)
    // const flagContract = new ethers.Contract("0x2AFFd06a1aFc7c8E98682BaBa2dd3B66B4f82CBf", flagRaw.abi, signer)
    console.log("address ", flagContract.address)
    console.log("Flag holder before capture",await flagContract.flagHolder())
    await flagContract.captureFlag()
    console.log("flag holder after capture", await flagContract.flagHolder())

    const gsnProvider = await getGSNProvider()
    const gsnAccount = gsnProvider.provider.newAccount()
    const gsnSigner = gsnProvider.getSigner(gsnAccount.address, gsnAccount.privateKey)
    console.log("Gsn address ", await gsnSigner.getAddress(), gsnAccount.address, gsnAccount.privateKey)

    await flagContract.connect(gsnSigner).captureFlag()
    console.log("flag holder after gasless capture", await flagContract.flagHolder())

}

run()


const getGSNProvider = async () => {
    const web3Provider = new Web3("http://localhost:8545");
    const gsnProvider = await Gsn.RelayProvider.newProvider({
        provider: web3Provider.currentProvider,
        config: {
          paymasterAddress: naivePaymaster,
        //   preferredRelays: ["http://127.0.0.1:8090"]
        },
    }).init();
    console.log(await web3Provider.eth.getChainId())
    const etherProvider = new ethers.providers.Web3Provider(gsnProvider);
    return etherProvider
}
// getGSNProvider()
