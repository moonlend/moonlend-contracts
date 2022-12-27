const func = async function (hre) {
  const {deployments, getNamedAccounts, ethers} = hre;
  const {deployIfDifferent, log} = deployments;
  
  if(process.env.DEPLOY !== "true"){
    throw new Error("DEPLOY env var must be true")
  }

  const {deployer} = await getNamedAccounts();

  const MoonLendFactoryDeployment = await deployments.get('MoonLendFactory');
  const MoonLendFactory = await ethers.getContractFactory("MoonLendFactory");
  const factory = await MoonLendFactory.attach(MoonLendFactoryDeployment.address)

  const chainId = await (await ethers.getSigner()).getChainId()
  const isTestnet = chainId == 1287;

  const params = [
    isTestnet? "0x70997970C51812dc3A010C7d01b50e0d17dc79C8" // Fake oracle
    :"0x3cdAf1201bc92240c119b916cA45e28a49ad0791", // Real oracle
    "60000000000000000", // 0.06 eth
    isTestnet?
       "0x9ceAB9b5530762DE5409F2715e85663405129e54"  // SeaScape NFT
      :"0xB6E9e605AA159017173CAa6181C522Db455F6661", // Damned Pirates Society
    "1000000000000000000", // 1 eth
    "DPSLoan",
    "DPSL",
    "1209600", // 2 weeks
    {
      maxVariableInterestPerEthPerSecond: "25367833587", // 80% p.a.
      minimumInterest: "12683916793", // 40% p.a.
      ltv: "330000000000000000", // 33% LTV
    }
  ]

  const deployResult = await (await factory.createPool(
    ...params,
    {
      from: deployer
    }
  )).wait()

  const poolAddress = deployResult.events[3].args.pool
  log(`contract LendingPool deployed at ${poolAddress}`);
};
module.exports = func;
func.tags = ['LendingPool'];
func.dependencies = ['MoonLendFactory'];