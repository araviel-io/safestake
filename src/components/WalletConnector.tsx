import { LAMPORTS_PER_SAFE } from '@safecoin/web3.js';
import { useContext, useMemo } from 'react';
import { AccountsContext } from '../contexts/accounts';
import { useWallet } from '../contexts/wallet';

export default function WalletConnector() {
  const { systemProgramAccountInfo } = useContext(AccountsContext);
  const { publicKey, connected, select, disconnect } = useWallet();
  const { manualPublicKey, manualPublicKeyString, setManualPublicKeyString } = useContext(AccountsContext);

  const balance = useMemo(() => {
    return systemProgramAccountInfo && (systemProgramAccountInfo.lamports / LAMPORTS_PER_SAFE);
  }, [systemProgramAccountInfo])

  function NullBalance() {
    return (
      <div className="h-full w-full my-3 flex flex-wrap justify-between text-center">
        <div className="safeBoxAlert w-full font-light flex flex-wrap justify-between items-center">
          <div className="text pl-5 pt-1">
            <span>

            </span>
          </div>
          <div className="w-full p-3 text-center">
            Insufficient funds to create a stake account
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full w-full my-3 flex flex-wrap justify-between text-center">
      {!connected ? (
        <>

          {/* Input wallet key */}
          <div className="w-full lg:w-4/5 text-solblue-dark">
            <div className="border-b border-gray-600 dark:border-solblue">
              <input
                className="w-full h-7 px-5 text-xs placeholder-gray-700 dark:placeholder-solblue border-none bg-transparent dark:text-solblue"
                type="text"
                placeholder="Public Key / Wallet Address"
                value={manualPublicKeyString}
                onChange={(event) => setManualPublicKeyString(event.target.value)}
              />
            </div>
            <span hidden={manualPublicKeyString === '' || manualPublicKey !== undefined} className="text-xs text-red-600 font-bold">Public Key not valid.</span>
          </div>

          {/* Connect wallet button */}
          <div className="pb-4 pt-2 lg:pt-0 text-center lg:text-right w-full lg:w-1/5">
            <button className="solBtnGray pb-0.5"
              onClick={select}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mb-0.5 mr-1.5 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Connect Wallet
            </button>
          </div>
        </>
      ) :
        (
          <>

            <div className="solBoxBlue w-full font-light flex flex-wrap justify-between items-center">
              <div className="text pl-5 pt-1">
                <span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mb-0.5 mr-1.5 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>

                  {publicKey?.toBase58()}
                </span>
              </div>
              {/* buttons cluster/disconect */}
              <div className="w-full lg:w-2/5 p-3 text-center md:text-right">
                <button className="solBtnGray" onClick={disconnect}>Disconnect</button>
              </div>
            </div>
            {!balance ? <NullBalance /> : <></>}
          </>
        )}
    </div>
  );
}