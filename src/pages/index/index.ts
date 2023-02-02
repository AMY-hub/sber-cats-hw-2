import { emit } from '../../app/ts/helpers/helpers';
import Cards from '../../components/cards/cards';
import CatForm from '../../components/cat-form/cat-form';
import Details from '../../components/details/details';
import ErrorMessage from '../../components/error/error';
import Header from '../../components/header/header';
import LoginForm from '../../components/login-form/login-form';

class IndexPage {
    private indexComponents = {
        'cards': Cards,
        'details': Details,
        'error': ErrorMessage,
        'header': Header
    }

    initIndexPage = () => {
        try {
            for (let key in this.indexComponents) {
                const element = document.querySelector(`.${key}`);
                if (element) {
                    new this.indexComponents[key]({
                        name: key,
                        component: element
                    })
                }
                console.log(`Element ${key} created`);
            }
        } catch (e: any) {
            emit('app:error', e.message)
            console.error('Ошибка во время инициализации компонента');
            console.error(e.message);
        }
    }
}

export default IndexPage;
