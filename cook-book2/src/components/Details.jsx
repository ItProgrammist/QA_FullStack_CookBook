
export function Details({ details, setDetails }){
    return (
        <>
            <h1>{details.title}</h1>
            <div>{details.description}</div>
            <button onClick={() => setDetails(prev => {
                return {
                    ...prev,
                    title: prev.title + '...'
                }
            })}>
                {details.buttonText}
            </button>
        </>
    )
}