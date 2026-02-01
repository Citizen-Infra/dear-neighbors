import { render } from 'preact';
import { PopupForm } from './components/PopupForm';
import './styles/variables.css';
import './styles/global.css';
import './styles/popup.css';

render(<PopupForm />, document.getElementById('app'));
