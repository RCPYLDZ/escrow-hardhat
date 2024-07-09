export function addEscrowToStorage (_signerAddress,_escrowDetail,contractList) {
    contractList.push({signerAddress:_signerAddress,escrowDetail:_escrowDetail});
}

export async function getDeployedContracts(_signerAddress,contractList){
    let result = [];
    for(let i = 0; i < contractList.length; i++){
        if(contractList[i].signerAddress===_signerAddress){
            result.push(contractList[i].escrowDetail);
        }
    }
    return result;
}
