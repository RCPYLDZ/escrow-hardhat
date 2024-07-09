import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import deploy from './deploy';
import Escrow from './Escrow';
import {addEscrowToStorage,getDeployedContracts} from './operations';

const provider = new ethers.providers.Web3Provider(window.ethereum);
const DEPLOYED_CONTRACTS = [];
export async function approve(escrowContract, signer) {
  const approveTxn = await escrowContract.connect(signer).approve();
  await approveTxn.wait();
}

export async function cancel(escrowContract, signer) {
  const cancelTxn = await escrowContract.connect(signer).cancel();
  await cancelTxn.wait();
}

function App() {
  const [escrows, setEscrows] = useState([]);
  const [account, setAccount] = useState();
  const [signer, setSigner] = useState();

  useEffect( () => {
    async function getAccounts() {
      const accounts = await provider.send('eth_requestAccounts', []);

      setAccount(accounts[0]);
      setSigner(provider.getSigner());
    }

    getAccounts();
  }, [account]);

  async function newContract() {
    const beneficiary = document.getElementById('beneficiary').value;
    const arbiter = document.getElementById('arbiter').value;
    const value = ethers.utils.parseEther(document.getElementById('eth').value);
    const escrowContract = await deploy(signer, arbiter, beneficiary, value);

    const escrow = {
      address: escrowContract.address,
      arbiter,
      beneficiary,
      value: value.toString(),
      handleApprove: async () => {
        escrowContract.on('Approved', () => {
          document.getElementById(escrowContract.address + '-approve').className = 'complete';
          document.getElementById(escrowContract.address + '-approve').innerText = "✓ It's been approved!";
          document.getElementById(escrowContract.address + '-cancel').innerText = "";
          document.getElementById(escrowContract.address + '-cancel').className = 'complete';
        });

        await approve(escrowContract, signer);
      },
      handleCancel: async() =>{
        escrowContract.on('Cancelled', () =>{
          document.getElementById(escrowContract.address + '-cancel').className = 'complete';
          document.getElementById(escrowContract.address + '-cancel').innerText = "x It's been cancelled!";
          document.getElementById(escrowContract.address + '-approve').innerText = "";
          document.getElementById(escrowContract.address + '-approve').className = 'complete';
        });
        await cancel(escrowContract, signer);
      }
    };
    addEscrowToStorage(await signer.getAddress(), escrow,DEPLOYED_CONTRACTS);
    setEscrows([...escrows, escrow]);
  }

  return (
    <>
      <div className="contract">
        <h1> New Contract </h1>
        <label>
          Arbiter Address
          <input type="text" id="arbiter"/>
        </label>

        <label>
          Beneficiary Address
          <input type="text" id="beneficiary"/>
        </label>

        <label>
          Deposit Amount (in ETH)
          <input type="text" id="eth"/>
        </label>

        <div
            className="button"
            id="deploy"
            onClick={(e) => {
              e.preventDefault();

              newContract();
            }}
        >
          Deploy
        </div>
        <div
            className="button"
            id="deploy"
            onClick={async (e) => {
              e.preventDefault();

              const accounts = await provider.send('eth_requestAccounts', []);

              setAccount(accounts[0]);
              setSigner(provider.getSigner());
              let contracts = await getDeployedContracts(await signer.getAddress(),DEPLOYED_CONTRACTS);
              setEscrows(contracts);
            }}
        >
          Get Account Existing Escrows
        </div>
      </div>

      <div className="existing-contracts">
        <h1> Existing Contracts </h1>

        <div id="container">
          {escrows.map((escrow) => {
            return <Escrow key={escrow.address} {...escrow} />;
          })}
        </div>
      </div>
    </>
  );
}

export default App;
