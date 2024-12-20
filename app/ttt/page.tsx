export default async function TTT() {
    const res=await fetch("http://localhost:3000/api/hello")
    const data=await res.json()
    console.log(data)
  
    return <div>{data.message}</div>
}