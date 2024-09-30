'use client';
import React from 'react';
import { signIn, signOut, useSession } from 'next-auth/react'

const SignInButton = () => {
	const { data: session } = useSession();

	if (session && session.user){
		return (
			<div className="flex gap-4 ml-auto">
				{session.user.image && (
				<img
					src={session.user.image}
					alt={`${session.user.name}'s profile picture`}
					className="w-8 h-8 rounded-full"
				/>
				)}
				<p className="text-sky-600">{session.user.name}</p>
				<button onClick={() => signOut()} className="text-red-600">
					Sair
				</button>
			</div>
		);
	}
	return (
		<button onClick={() => signIn()} className="text-green-600 ml-auto">
			Entrar
		</button>
	);
};

export default SignInButton;
