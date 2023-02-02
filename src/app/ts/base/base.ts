export type ComponentProps<T = HTMLElement> = {
    name: string;
    component: T;
};

abstract class Component {

    public nRoot: HTMLElement;
    public nRootName: string;

    protected constructor({ name, component }: ComponentProps) {
        this.nRoot = component;
        this.nRootName = name;
    }

    public getElement = <T extends HTMLElement>(name: string): T | undefined => {
        return this.nRoot.querySelector<T>(`.${this.nRootName}__${name}`) ?? undefined;
    };

    public getElements = <T extends HTMLElement>(name: string): T[] => {
        return Array.from(this.nRoot.querySelectorAll(`.${this.nRootName}__${name}`));
    };

    public destroy = (): void => {};
}

export default Component;