import { Android } from "../components/icons/Android.jsx";
import { Apple } from "../components/icons/Apple.jsx";

export default function PWA() {
    return (
        <div className="w-100 h-100 p-4 d-flex flex-column align-items-center justify-content-center text-center isInstalledStyle">
            <div className="sfpl pb-3">SFPL</div>
            <div>Install this app on your home screen to continue.</div>
            <div className="instructions">
                <div className="p-3 pt-5 d-flex justify-content-center align-items-start">
                    <Apple height={17} width={17} />
                    <span className="ps-1">IOS</span>
                </div>
                <div>
                    1. Tap Share
                    <br/>
                    2. Scroll down and tap Add to Home Screen
                    <br/>
                    3. Tap Add
                </div>
                <div className="p-3 pt-5 d-flex justify-content-center align-items-start">
                    <Android height={17} width={17}/>
                    <span className="ps-1">Android</span>
                </div>
                <div>
                    1. Tap three-dot menu
                    <br />
                    2. Tap Add to Home Screen (or Install App)
                    <br />
                    3. Tap Add
                </div>
            </div>
        </div>
    )
}