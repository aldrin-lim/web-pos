import ThemePicker from './components/ThemePicker'

const Showcase = () => {
  return (
    <div className="App box-content flex flex-col gap-4 p-4 lg:flex-row">
      <div className="card w-96 bg-base-100 ">
        <div className="card-body">
          <h2 className="card-title">Card title!</h2>
          <p>If a dog chews shoes whose shoes does he choose?</p>
          <div className="card-actions justify-end">
            <button className="btn btn-primary">Buy Now</button>
          </div>
        </div>
      </div>
      <div className="card flex w-1/2 flex-col">
        <div className="card-body flex flex-col gap-5">
          <h1>Hello Juan</h1>
          <button className="btn btn-primary">Button</button>
          <div className="join">
            <div>
              <div>
                <input
                  className="input join-item input-bordered"
                  placeholder="Search"
                />
              </div>
            </div>
            <select className="join-item select select-bordered">
              <option disabled selected>
                Filter
              </option>
              <option>Sci-fi</option>
              <option>Drama</option>
              <option>Action</option>
            </select>
            <div className="indicator">
              <span className="badge indicator-item badge-secondary">new</span>
              <button className="btn join-item">Search</button>
            </div>
          </div>
        </div>
      </div>
      <ThemePicker />
    </div>
  )
}

export default Showcase
