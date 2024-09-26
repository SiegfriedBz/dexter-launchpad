"use client";

import Image from "next/image";
import { OrderSide, tokenSlice } from "@/app/_store/tokenSlice";
import { useAppDispatch, useAppSelector } from "@/app/_hooks/hooks";
import { fetchToken } from "@/app/_store/tokenSlice";
import { useEffect } from "react";
import Link from "next/link";
import ChartOrInfo from "./PriceChart";

type TProps = {
  tokenAddress: string;
};

interface OrderSideTabProps {
  orderSide: OrderSide;
}

// SHortens radix wallet address
function shortenWalletAddress(address: string): string {
  // minimal length is 35 chars
  if (address.length < 35) {
    return address;
  }
  const firstPart = address.slice(0, 8);
  const lastPart = address.slice(-20);
  return `${firstPart}...${lastPart}`;
}

function OrderSideTabs() {
  return (
    <div
      // OUTSIDE_CONTAINER_MAX_WIDTH
      className={`h-[40px] flex w-full`}
    >
      {[OrderSide.BUY, OrderSide.SELL].map((currentSide, indx) => (
        <OrderSideTab orderSide={currentSide} key={indx} />
      ))}
    </div>
  );
}

function OrderSideTab({ orderSide }: OrderSideTabProps): JSX.Element | null {
  const side = useAppSelector((state) => state.token.formInput.side);
  const dispatch = useAppDispatch();

  return (
    <div
      className={`w-1/2 flex justify-center items-center cursor-pointer hover:opacity-100 border rounded-tl-sm rounded-tr-sm ${
        side === "BUY" && orderSide === "BUY"
          ? "bg-dexter-gray-dark text-dexter-green bg-dexter-gray-c"
          : side === "SELL" && orderSide === "SELL"
          ? "text-dexter-red-c bg-dexter-gray-dark bg-dexter-gray-c"
          : "opacity-50"
      }`}
      onClick={() => {
        dispatch(tokenSlice.actions.setOrderSide(orderSide));
      }}
    >
      <p className="font-bold text-sm tracking-[.1px] select-none uppercase">
        {orderSide}
      </p>
    </div>
  );
}

const TokenDetails = ({ tokenAddress }: TProps) => {
  const dispatch = useAppDispatch();

  const { token, side, lastPrice, supply, readyToDexter, available } =
    useAppSelector((state) => ({
      token: state.token.token,
      side: state.token.formInput.side,
      lastPrice: state.token.lastPrice,
      supply: state.token.supply,
      readyToDexter: state.token.readyToDexter,
      available: state.token.available,
    }));

  // useEffect fetch token data
  useEffect(() => {
    async function loadTokenData() {
      await dispatch(fetchToken(tokenAddress));
    }
    loadTokenData();
  }, [dispatch, tokenAddress]);

  return (
    <div>
      <div className="max-w-3xl mx-auto">
        <div className="grid md:grid-cols-2 gap-2 !grid-cols-[60%_40%]">
          <div className="flex justify-center">
            <Image
              src={token.iconUrl}
              alt={`${token.name} token image`}
              width={400}
              height={150}
              className="object-cover rounded-xl h-64"
            />
          </div>
          <div className="p-4">
            <div className="font-[family-name:var(--font-londrina-solid)] text-4xl text-dexter-green-OG/90">
              {token.name}
            </div>
            <div className="font-[family-name:var(--font-josefin-sans)]">
              <div className="text-xs pt-2 pb-4 font-semibold">
                Created by: {shortenWalletAddress(tokenAddress)}
              </div>
              <div className="text-white text-opacity-40">
                {token.description}
              </div>
            </div>
          </div>
          <div className="flex justify-center items-center text-white">
            <Chart />
          </div>
          <div className="font-[family-name:var(--font-josefin-sans)]">
            <div className="">
              <OrderSideTabs />
            </div>
            <div className="border border-white-1 p-6 rounded-bl-sm rounded-br-sm bg-dexter-gray-c">
              <div className="flex flex-row justify-between mt-3">
                <p>Last Price:</p>
                <p>{lastPrice}</p>
              </div>
              <p className="mt-4">Amount</p>
              <div className="mt-2">
                <input
                  type="text"
                  className="text-sm grow w-full pl-2 bg-dexter-grey-dark rounded-lg h-10"
                  placeholder="0.00"
                />
              </div>
              {side === "SELL" && ( // Check if the current order side is SELL
                <Link
                  href=""
                  className="flex justify-center w-full mx-auto gap-2 bg-dexter-red-b hover:bg-dexter-red-c rounded-lg text-white px-4 py-3 max-lg:self-center shadow-md shadow-dexter-red-b transition duration-300 mt-4 mb-4"
                >
                  <span className="font-bold text-sm">Sell Stonks!</span>
                </Link>
              )}
              {side === "BUY" && (
                <Link
                  href=""
                  className="flex justify-center w-full mx-auto gap-2 bg-dexter-green-OG/90 hover:bg-dexter-gradient-green rounded-lg text-dexter-grey-light px-4 py-3 max-lg:self-center shadow-md shadow-dexter-green-OG transition duration-300 mt-4 mb-4"
                >
                  <span className="font-bold text-sm">Buy Stonks!</span>
                </Link>
              )}
            </div>
            <div>
              <div className="flex flex-row justify-between mt-8">
                <p>Supply:</p>
                <p>{supply}</p>
              </div>
              <div className="flex flex-row justify-between mt-1">
                <p>Available:</p>
                <p>{available}</p>
              </div>
              <div className="flex flex-row justify-between mt-1">
                <p>Ready to DeXter:</p>
                <p>{readyToDexter}</p>
              </div>
              <p className="text-white text-opacity-40 pt-4 leading-none">
                When the market cap reaches 1,000 XRD all the liquidity from the
                bonding curve will be deposited into DeXter and burned.
                progression increases as the price goes up.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TokenDetails;

const Chart = () => {
  return <ChartOrInfo />;
};
