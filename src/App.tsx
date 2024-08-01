import React from 'react'
import { useSearchParams } from 'react-router-dom'
import { Tab, Tabs, TabList } from '@chakra-ui/react'

import './App.css'
import { Moodle } from './components/Moodle'
import { LCloud } from './components/LCloud'
import tableSimpleSvg from './assets/table_simple.svg'
import tableForMoodle from './assets/tableForMoodle.svg'
import { Transliteration } from './components/Transliteration'
import { GoogleWorkspace } from './components/GoogleWorkspace'
import tableForGoogleWorkspace from './assets/tableForGoogleWorkspace.svg'

// Google:
// First Name [Required]	Last Name [Required]	Email Address [Required]	      Password [Required]	 Org Unit Path [Required]
// Бейтуллаєва	          Людмила	              beitulaeva.liudmyla@pharm.zt.ua 29101990	           /Студенти/Післядипломна/PHe-23-5
// Болобан	              Лілія	                boloban.liliia@pharm.zt.ua	    21041989	           /Студенти/Післядипломна/PHe-23-5

//

// MOODLE:
// username	            email	                          password	firstname	 lastname	   alternatename department	cohort1	profile_field_Role
// beitulaeva.liudmyla	beitulaeva.liudmyla@pharm.zt.ua	12345678	Людмила	   Бейтуллаєва 104-22	       104-22	    g104	  Студент

//

// Cloud:
// Без шапки
// Бейтуллаєва Людмила Павлівна 1997-04-27	12
// Болобан Лілія Олегівна       2004-06-20	12
// Біділо Дар’я Олександрівна   2003-12-28	12

const tabs = ['Google Workspace', 'Moodle', 'LCloud', 'Transliteration']

const App = () => {
  const [activeTab, setActiveTab] = React.useState(tabs[0])
  const [searchParams, setSearchParams] = useSearchParams()

  const handleChangeTab = (newValue: number) => {
    setSearchParams({ tab: tabs[newValue] })
  }

  React.useEffect(() => {
    const tab = searchParams.get('tab')
    // @ts-ignore
    if (tab) setActiveTab(tab)
  }, [searchParams])

  return (
    <div style={{ padding: '0 20px' }}>
      <div style={{ maxWidth: '500px', margin: '0 auto 40px' }}>
        <h1 style={{ margin: '20px', textAlign: 'center' }}>Download xlsx file</h1>

        <Tabs
          variant="soft-rounded"
          colorScheme="green"
          onChange={(e) => handleChangeTab(e)}
          index={tabs.indexOf(activeTab)}
        >
          <TabList style={{ justifyContent: 'center' }}>
            {tabs.map((el) => (
              <Tab key={el} className="tab">
                {el}
              </Tab>
            ))}
          </TabList>
        </Tabs>

        <h2 style={{ fontSize: '26px', marginTop: '40px', textAlign: 'center' }}>{activeTab}</h2>

        {activeTab === tabs[0] && <GoogleWorkspace />}
        {activeTab === tabs[1] && <Moodle />}
        {activeTab === tabs[2] && <LCloud />}
        {activeTab === tabs[3] && <Transliteration />}
      </div>

      <h2 style={{ fontSize: '26px', marginTop: '40px', textAlign: 'center' }}>XLSX example:</h2>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        {activeTab === tabs[0] && <img src={tableForGoogleWorkspace} width={1000} />}
        {activeTab === tabs[1] && <img src={tableForMoodle} width={1000} />}
        {activeTab === tabs[2] && <img src={tableForMoodle} width={1000} />}
        {activeTab === tabs[3] && <img src={tableSimpleSvg} width={300} />}
      </div>
    </div>
  )
}

export default App
