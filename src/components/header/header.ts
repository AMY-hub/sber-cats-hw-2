import Component, { ComponentProps } from '../../app/ts/base/base';
import { checkUserCookies, emit, getAllCookies, listen } from '../../app/ts/helpers/helpers';
import ButtonIcon from '../button-icon/button-icon';
import Button from '../button/button';

export default class Header extends Component {
    isLoggedIn: boolean = false;
    addButton: ButtonIcon;
    loginButton: Button;
    logoutButton: Button;

    constructor(elProps: ComponentProps) {
        super(elProps);

        this.addButton = new ButtonIcon({ name: 'button-icon', component: this.getElement('add')!});
        this.loginButton = new Button({ name: 'button', component: this.getElement('auth')! });
        this.logoutButton = new Button({ name: 'button', component: this.getElement('logout')! });
        this.isLoggedIn = checkUserCookies();
        
        this.isLoggedIn ? this.onLogin() : this.onLogout();
        this.logoutButton.buttonElement.addEventListener('click', this.logout);
        listen('user:update', this.updateUser);
    }

    onLogin = () => {
        this.addButton.setDisabled(false);
        this.loginButton.nRoot.classList.add('hidden');
        this.logoutButton.nRoot.classList.remove('hidden');
    }

    onLogout = () => {
        this.addButton.setDisabled(true);
        this.loginButton.nRoot.classList.remove('hidden');
        this.logoutButton.nRoot.classList.add('hidden');
    }

    logout = () => { 
        document.cookie = `catUseremail=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; catUsername=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; c catUserpassword=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        emit('user:update', false);
    }

    updateUser = ({detail}: CustomEvent) => {
        if(typeof detail === 'boolean') {
            this.isLoggedIn = detail;
            detail ? this.onLogin() : this.onLogout();
        }
    }
}