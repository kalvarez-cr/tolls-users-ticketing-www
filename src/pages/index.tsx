import React, {useEffect} from 'react'
import FooterLayout from '@layouts/FooterLayout'
import InputV2 from '@components/inputs/InputV2'
import {useRouter} from 'next/router'
import {useForm, SubmitHandler} from 'react-hook-form'
import {useMutation} from 'react-query'
import {useAppDispatch, useAppSelector} from '@store/hooks'
import {login, loginUser} from '@store/counter/loginReducer'
import {open} from '@store/counter/snackbarReducer'
import {AxiosError} from 'axios'
import * as yup from 'yup'
import {yupResolver} from '@hookform/resolvers/yup'
import {useAxios} from 'hooks/useAxios'
import Button from '@components/Button'
import Link from 'next/link'

const IS_PROD = process.env.NODE_ENV == 'production'
const DEFAULT_USERNAME = IS_PROD ? '' : process.env.NEXT_PUBLIC_DEFAULT_USERNAME
const DEFAULT_PASSWORD = IS_PROD ? '' : process.env.NEXT_PUBLIC_DEFAULT_PASSWORD

interface Inputs {
    email: string;
    password: string;
}

const initialValues = {
    name: IS_PROD ? '' : DEFAULT_USERNAME,
    password: IS_PROD ? '' : DEFAULT_PASSWORD,
}

const Schema = yup.object().shape({
    email: yup
        .string()
        .email('Debe ser un correo válido')
        .required('Este campo es requerido'),
    password: yup
        .string()
        .min(8, 'Mínimo 8 caracteres')
        .max(12, 'Máximo 12 caracteres')
        .required('Este campo es requerido'),
})

const Index = () => {
    const router = useRouter()
    const {requester} = useAxios()
    const dispatch = useAppDispatch()
    const [items] = React.useState(initialValues)
    const {loggedIn} = useAppSelector(loginUser)

    const {mutate, isLoading} = useMutation(
        (formData: Inputs) => {
            return requester({
                method: 'POST',
                data: formData,
                url: '/login/',
            })
        },
        {
            onSuccess: (response) => {
                const {data} = response

                dispatch(login(data));
                router.push('/home')
            },
            onError: (error: AxiosError) => {
                dispatch(open({text: error.response.statusText, type: 'error'}))
            },
        }
    )

    useEffect(() => {
        loggedIn ? router.push('/home') : null
    }, [loggedIn])

    const {
        register,
        handleSubmit,
        formState: {errors},
    } = useForm<Inputs>({
        resolver: yupResolver(Schema),
    })

    const onSubmit: SubmitHandler<Inputs> = async (data) => {
        const {email, password} = data
        mutate({email, password})
    }

    return (
        <div className="flex items-center bg-gradient-to-b from-cyan-100 to-cyan-500">
            <FooterLayout>
                <div
                    className="login-form mx-auto my-auto flex flex-col items-center justify-center rounded-2xl bg-cyan-50 p-10 shadow-2xl">
                    <div>
                        <div className="">
                            <img src="/logo-login.png" alt="logo" className="logo"/>
                        </div>
                        <h1 className="motto-line">
                            Un TAG, todas las vías
                        </h1>
                        <form className="mt-12" onSubmit={handleSubmit(onSubmit)}>
                            <div className="mt-16">
                                <InputV2
                                    label="Correo electrónico"
                                    name="email"
                                    type="text"
                                    errorMessage={errors.email?.message}
                                    register={register}
                                    defaultValue={items.name}
                                />
                            </div>
                            <div className="mt-16">
                                <InputV2
                                    label="Contraseña"
                                    name="password"
                                    type="password"
                                    errorMessage={errors.password?.message}
                                    register={register}
                                    defaultValue={items.password}
                                />
                            </div>
                            <div className="mt-8">
                                <Button loading={isLoading} type="submit" text="Ingresar"/>
                            </div>
                        </form>

                        {<Link href="register">
                            <p className="mt-4 cursor-pointer text-center text-sm">
                                No tienes una cuenta?{' '}
                                <span className="font-bold text-blue-800 decoration-2 hover:text-blue-600">
                                    Regístrate
                                </span>
                            </p>
                        </Link>}
                    </div>
                </div>
            </FooterLayout>

            <div className="hidden w-full lg:block">
                <img className="aspect-1 max-h-screen" src="/login.svg" alt="login"/>
            </div>
        </div>
    )
}

// noinspection JSUnusedGlobalSymbols
export default Index
