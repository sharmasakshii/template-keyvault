import { useAppSelector } from 'store/redux.hooks';
import GreenInsightRoute from './routes/GreenInsightRoute';
const App = () => {

  const { fileDownloadLoading } = useAppSelector((state) => state.file)

  return (
    <div data-testid="app-component">
      {fileDownloadLoading && <div className='download-toast'>Your file is being downloaded, please wait...</div>}
      <GreenInsightRoute />
    </div>

  );
}

export default App;
