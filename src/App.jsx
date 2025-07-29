import CampaignGrid from './components/CampaignGrid';
import "./styles/grid.css"


function App() {
  return (
    <div className="container-fluid p-4"
      style={{
        width: '100dvw',
        height: '100dvh',
        textAlign: 'center',
      }}
    >
      <h1 className="text-2xl font-bold">Campaign Listing Page</h1>
      <CampaignGrid />
    </div>
  );
}

export default App;
