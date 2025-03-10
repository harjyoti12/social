import React, { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '../ui/button'
import { useSignOutAccountMutation } from '@/lib/react_query/queriesAndMutation'
import { useUserContext } from '@/context/AuthContext'

const Topbar = () => {
    const {mutate:signOut, isSuccess} = useSignOutAccountMutation();
    const navigate = useNavigate();
    const {user} = useUserContext();
    useEffect(() => {
      if(isSuccess)
        navigate(0)
    }, [isSuccess])
    
  return (
   <section className='topbar'>
<div className="flex-between py-4 px-5">
    <Link to='/' className='flex gap-3 items-center' >
    <img src='/public/assets/images/logo.svg' width={130} height={325}/>
    </Link>

    <div className='flex gap-4'>
        <Button variant='ghost' className='shad-button_ghost' onClick={()=>signOut()}>
            <img src="/public/assets/icons/logout.svg" alt="logout" />
        </Button>
        <Link to={`/profile/${user.id}`} className='flex-center gap-3'>
        <img src={user.imageUrl || '/public/assets/images/profile.png'} alt="profile" className='h-8 w-8 rounded-full'/>
        </Link>
    </div>
</div>
   </section>
  )
}

export default Topbar
