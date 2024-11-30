import axios from 'axios'
import React from 'react'
import { BASE_URL } from '../utils/constants'
import { useDispatch } from 'react-redux'
import { removeFeed } from '../utils/feedSlice'

const UserCard = ({ user }) => {
    const dispatch = useDispatch()
    const { _id, firstName, lastName, photoUrl, about, skills, age, gender} = user
    const handleSendRequest = async (status, userId) =>{
        try {
            const res = await axios.post(BASE_URL+ "/request/sent/"+status +"/" + userId, {}, { withCredentials: true})
            dispatch(removeFeed(userId))
        } catch(err) {
            console.error(err)
        }
    }
    return (
        <div>
            <div className="card bg-base-100 w-96 shadow-xl">
                <figure className="px-10 pt-10">
                    <img
                        src={photoUrl}
                        alt="progile"
                        className="rounded-xl" />
                </figure>
                <div className="card-body items-center text-center">
                    <h2 className="card-title">{firstName+" "+lastName}</h2>
                    <p>{about}</p>
                    <p>{age && gender && age+" "+gender}</p>
                    <div className="card-actions">
                        <button className="btn btn-primary"
                        onClick={() => handleSendRequest("ignored", _id)}
                        >Ignore</button>
                        <button className="btn btn-primary"
                        onClick={() => handleSendRequest("interested", _id)}
                        >Send Request</button>

                    </div>
                </div>
            </div>
        </div>
    )
}

export default UserCard
