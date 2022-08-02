import SurfImg from '../assets/icons/favicon.png';


function toUrl(tokenPath: string): string {
    const host = window.location.origin;
    return `${host}/${tokenPath}`;
}

export function getTokenUrl(name: string) {
    if (name == "surf") {
        return toUrl(SurfImg);
    }
    throw Error(`Token url doesn't support: ${name}`);
}
