"use client"

import React from "react";
import useSWR from "swr";

const Page = () => {

const fetcher = (...args) => fetch(...args).then((res) => res.json());
  
	const { data, mutate, error, isLoading } = useSWR(
	  `/api/reports?Department=Medical&Type=Department`,
	  fetcher
	);

    if (!isLoading) {
        console.log(data)
        return (<>Test</>)
    }

    return (<>test</>)

}

export default Page;