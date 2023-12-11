//404 file
import { Link } from 'react-router-dom';
function NotFound() {
  return (
    <div className="not-found-container">
      <h1>404 - Not Found</h1>
      <p>Sorry, the page you are looking for does not exist.</p>
      <p><Link to="/">Home</Link></p>
    </div>
  );
}
export default NotFound;
