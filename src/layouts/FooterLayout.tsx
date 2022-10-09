import React from 'react'

const FooterLayout = ({children}) => {
    return (
        <div className="flex h-screen w-screen flex-col justify-between">
            {children}
            <div className="my-2 w-full p-2">
                <div className="my-4 flex justify-around">
                    <img src="/fontur.svg" alt="fontur" className="h-14"/>
                    <img src="/fontur2.svg" alt="fontur2" className="h-14"/>
                    <img src="/fontur3.svg" alt="fontur3" className="h-14"/>
                </div>
                <p className="my-2 text-center">Copyright © 2022 Fontur.</p>
            </div>
        </div>
    )
}

export default FooterLayout
