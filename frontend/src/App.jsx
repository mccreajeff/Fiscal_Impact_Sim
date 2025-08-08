import { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { getMetadata, postSimulate  } from './lib/api'
import { defaultValues } from "./lib/schema";
import './App.css'
import Header from './components/Header'
import Footer from './components/Footer'
import ControlPanel from './components/ControlPanel'
import ResultsPanel from './components/ResultsPanel'

const apiBase = import.meta.env.VITE_API_BASE

export default function App() {
  const [count, setCount] = useState(0)
  const simulate = useMutation({
    mutationFn: postSimulate,
    onSuccess: () => setLastRunIso(new Date().toISOString()),
  });
  const meta = useQuery({
    queryKey: ['meta'],
    queryFn: getMetadata,
    staleTime: 60_000,       // cache for a minute
    refetchOnWindowFocus: false,
    retry: 1,
  });
  const metaLoading = meta.isLoading;
  const metaError   = meta.isError;
  const metadata    = meta.data; // undefined until success
  const controlsDisabled = metaLoading || !metadata?.baselineLoaded;
  return (
    <>
      <div>
        <Header
          title='Fiscal Impact Simulator'
        />
        <ControlPanel
          disabled={meta.isLoading || !meta.data?.baselineLoaded}
          defaultValues={defaultValues}
          taxRateRange={meta.data?.taxRateRange ?? [0, 50]}
          deltaRange={meta.data?.deltaRange ?? [-1, 1]}
          onRun={(values) => simulate.mutate(values)}
        />
        <ResultsPanel

        />
        <Footer
          baselineLoaded={!!metadata?.baselineLoaded}
          version={metadata?.version}
        />
      </div>
    </>
  )
}

