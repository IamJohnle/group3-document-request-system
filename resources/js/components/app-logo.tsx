export default function AppLogo() {
    return (
        <>
            <div className="flex aspect-square size-8 items-center justify-center rounded-md bg-white">
                <img
                    src="/images/LogoDrs.png"
                    alt="Logo"
                    className="size-10 object-contain"
                />
            </div>
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="text-lg leading-tight font-semibold">
                    Doc Request
                </span>
            </div>
        </>
    );
}
