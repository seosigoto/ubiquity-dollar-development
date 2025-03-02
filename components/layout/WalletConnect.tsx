import { useState } from "react";
import { Container, Title, Button, Icon, Tooltip } from "@/ui";
import { useWeb3 } from "@/lib/hooks";
import { useEffect } from "react";

const PROD = process.env.NODE_ENV == "production";

const WalletConnect = () => {
  const [walletModal, setWalletModal] = useState(false);
  const [{ walletAddress, providerMode, connecting }, { disconnect, connectMetamask }] = useWeb3();

  const promptConnectWallet = () => {
    setWalletModal(true);
  };

  useEffect(() => {
    if (walletModal && PROD) {
      connectMetamask();
    }
  }, [walletModal]);

  return (
    <>
      {walletModal && !walletAddress && !PROD && <Modal onClose={() => setWalletModal(false)} />}
      <div className="absolute top-0 right-0 z-40 mt-4 mr-8">
        {walletAddress ? (
          <div className="flex items-center justify-center">
            <Tooltip
              content={
                <>
                  {walletAddress}
                  <br />
                  Provider: {providerMode}
                </>
              }
              placement="bottom"
            >
              <a href={`https://etherscan.io/address/${walletAddress}`} target="_blank" className="mr-2 inline-block h-6 w-6 text-white/60">
                <Icon icon="help" />
              </a>
            </Tooltip>
            <Button onClick={() => disconnect()}>Disconnect</Button>
          </div>
        ) : (
          <>
            <Button styled="accent" disabled={connecting} onClick={() => promptConnectWallet()}>
              {connecting ? "Connecting..." : "Connect Wallet"}
            </Button>
          </>
        )}
      </div>
    </>
  );
};

export default WalletConnect;

function Modal({ onClose }: { onClose: () => void }) {
  const [, { connectMetamask, connectJsonRpc }] = useWeb3();

  function Btn({ text, onClick, icon }: { text: string; icon: string; onClick: () => void }) {
    return (
      <div onClick={() => onClick()} className="border-soli cursor-pointer rounded-lg border border-accent p-4 text-center hover:bg-accent/20">
        <div className="mb-4 flex h-20 items-center justify-center">
          <img className="w-20" src={"/providers-icons/" + icon + ".svg"} />
        </div>
        <span className="text-sm uppercase tracking-widest">{text}</span>
      </div>
    );
  }

  function promptForWalletAddress() {
    const promptedWallet = prompt("Wallet address to use and impersonate?");
    if (promptedWallet) {
      connectJsonRpc(promptedWallet);
    }
  }

  return (
    <div className="fixed top-0 left-0 z-50 flex h-full w-full items-center justify-center bg-black/50">
      <div className="absolute top-0 left-0 right-0 bottom-0 bg-black/50" onClick={() => onClose()}></div>
      <Container>
        <Title text="Connect wallet" />
        <div className="grid grid-cols-2 gap-4">
          <Btn text="Metamask" icon="metamask" onClick={connectMetamask} />
          <Btn text="Hardhat node" icon="hardhat" onClick={promptForWalletAddress} />
        </div>
      </Container>
    </div>
  );
}
