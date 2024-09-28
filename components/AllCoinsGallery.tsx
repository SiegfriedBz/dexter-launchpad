import { cn } from "@/lib/utils";
import { Suspense } from "react";
import AllCoinsGetDataWrapper from "./AllCoinsGetDataWrapper";
import { CoinCardSkeleton } from "./CoinCard";

type TProps = {
  className?: string;
};

// server-component
export const AllCoinsGallery = ({ className }: TProps) => {
  return (
    <div className="mt-[10rem] py-12">
      <h1 className="font-[family-name:var(--font-londrina-solid)] text-6xl flex justify-center">
        Last Tokens
      </h1>
      <div
        className={cn(
          "flex flex-wrap items-stretch max-md:place-content-center py-10 font-[family-name:var(--font-josefin-sans)] justify-center",
          className
        )}
      >
        <Suspense
          fallback={Array.from({ length: 12 }, (_, idx) => {
            return <CoinCardSkeleton key={idx} />;
          })}
        >
          {/* server-component */}
          <AllCoinsGetDataWrapper />
        </Suspense>
      </div>
    </div>
  );
};
