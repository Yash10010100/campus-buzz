import { Header, Sidebar } from './'

function CommonLayout({
    children,
    current,
}) {
    return (
        <div className='h-full overflow-auto'>
            <div className=' h-full flex'>
                <Sidebar current={current} />
                <div className=' pb-3 h-full w-full flex flex-col'>
                    <div className=' py-1.5 bg-[var(--sec-color)] w-full border-b-2 border-[var(--main-border-color)]'>
                        <div className=' h-12'>
                            <Header />
                        </div>
                    </div>
                    <div className=' border-l-2 border-b-2 border-[var(--main-border-color)] rounded-bl-[18px] p-2 h-full overflow-auto'>
                        <>{children}</>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default CommonLayout