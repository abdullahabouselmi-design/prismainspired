import { useState } from 'react'
import { Hero } from './components/Hero'
import { About } from './components/About'
import { Manifesto } from './components/Manifesto'
import { TheGap } from './components/TheGap'
import { Services } from './components/Services'
import { Process } from './components/Process'
import { Calibration } from './components/Calibration'
import { Work } from './components/Work'
import { WhoThisIsFor } from './components/WhoThisIsFor'
import { Contact } from './components/Contact'
import { Preloader, shouldShowPreloader } from './components/Preloader'
import { CustomCursor } from './components/CustomCursor'
import { useSmoothScroll } from './lib/useSmoothScroll'

function App() {
  const [loading, setLoading] = useState(() => shouldShowPreloader())

  useSmoothScroll()

  return (
    <>
      {loading ? <Preloader onDone={() => setLoading(false)} /> : null}
      <CustomCursor />
      <main>
        <Hero />
        <About />
        <Manifesto />
        <TheGap />
        <Services />
        <Process />
        <Calibration />
        <Work />
        <WhoThisIsFor />
        <Contact />
      </main>
    </>
  )
}

export default App
