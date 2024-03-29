import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { useForm } from "react-hook-form";

import { Box } from '../../atoms/box/Box.styled';
import { Typography } from '../../atoms/typography/Typography.styled';
import { Img } from '../../atoms/img/Img.styled';
import { Container } from "../../atoms/container/Container.styled";
import { Form } from "../../atoms/form/Form.styled";
import { Label } from "../../atoms/label/Label.styled";
import { Input } from "../../atoms/input/Input.styled";
import { Button } from "../../atoms/button/Button.styled";

import logo from "../../../shared/assets/images/logo.png";
import InterfaceImage from "../../../shared/assets/images/interface-image-full.png";

import {
    ALERT_1,
    ALMOST_BLACK_FOR_TEXT,
    GRADIENT,
    WHITE
} from "../../../shared/styles/variables";

import VisibilityOn from '../../../shared/assets/icons/visibility-on.svg';
import VisibilityOff from '../../../shared/assets/icons/visibility-off.svg';
import { RegisterFormData } from "../../../store/types";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { registerUser } from '../../../store/userSlice';
import { emailRegex, nameRegex, passwordRegex } from "../../../shared/utils/regexes";

const RegisterPage: React.FC = () => {
    const dispatch = useAppDispatch();

    const { registerError, isRegistered, isLoading } = useAppSelector(state => state.user)

    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const {
        register,
        formState: {
            errors,
            isValid,
        },
        handleSubmit,
        reset,
        watch,
    } = useForm({
        mode: "all",
    });
    const handleTogglePassword = () => {
        setShowPassword(!showPassword);
    };
    const handleToggleConfirmPassword = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    useEffect(() => {
        if (isRegistered) {
            navigate('/data-entry');
            reset();
        }
    }, [isRegistered]);

    async function handleSub(data: RegisterFormData) {
        await dispatch(registerUser(data));
    }

    return (
        <Container display="flex">
            <Box flex="1" overflow="hidden" height="100vh" background={GRADIENT}>
                <Img src={InterfaceImage} m="0 0 0 100px" alt="InterfaceImage" />
            </Box>
            <Box display="flex" flexDirection="column" width="592px" alignItems="center" textAlign="center"
                background={WHITE}>
                <Box m="auto 0" alignItems="center" textAlign="center">
                    <Img src={logo} alt="Logo" />
                    <Typography fw="700" fz="24px" lh="170%" m="20px 0" color={ALMOST_BLACK_FOR_TEXT} textAlign="center">
                        Реєстрація нового користувача
                    </Typography>
                    <Form onSubmit={handleSubmit(handleSub)} maxWidth="592px" textAlign="center"
                        alignItems="end">
                        <Box maxWidth="320px" alignItems="flex-start" m="0 auto">
                            <Box mb="10px">
                                <Label htmlFor="first_name" lh="16px" color={ALMOST_BLACK_FOR_TEXT} mb="6px"
                                    textAlight="left">Ім'я</Label>
                                <Input {...register('first_name', {
                                    required: 'Обов\'язкове поле для заповнення',
                                    pattern: {
                                        value: nameRegex,
                                        message: "Повинно бути не менше 2 літер",
                                    },
                                })} type="text" id="first_name" width="284px"
                                    className={errors.first_name && 'error'}
                                />
                                <Box color="red" textAlight="left" border="red" fz="13px" height="14px"
                                    m="0 0 20px 0">{errors?.first_name && <>{errors?.first_name?.message || 'Error!'}</>}</Box>
                                <Label htmlFor="last_name" lh="16px" color={ALMOST_BLACK_FOR_TEXT} mb="6px"
                                    textAlight="left">Прізвище</Label>
                                <Input {...register('last_name', {
                                    required: 'Обов\'язкове поле для заповнення',
                                    pattern: {
                                        value: nameRegex,
                                        message: "Повинно бути не менше 2 літер",
                                    },
                                })} type="text" id="last_name" width="284px"
                                    className={errors.last_name && 'error'}
                                />
                                <Box color="red" textAlight="left" border="red" fz="13px" height="14px"
                                    m="0 0 20px 0">{errors?.last_name && <>{errors?.last_name?.message || 'Error!'}</>}</Box>
                                <Label htmlFor="email" lh="16px" color={ALMOST_BLACK_FOR_TEXT} mb="6px"
                                    textAlight="left">Пошта</Label>
                                <Input {...register('email', {
                                    required: 'Обов\'язкове поле для заповнення',
                                    pattern: {
                                        value: emailRegex,
                                        message: "Введіть коректну електронну адресу"
                                    }
                                })} type="email" id="email" width="284px"
                                    className={errors.email && 'error'}
                                />
                                <Box color="red" textAlight="left" border="red" fz="13px" height="14px"
                                    m="0 0 20px 0">{errors?.email && <>{errors?.email?.message || 'Error!'}</>}</Box>
                                <Label htmlFor="password" lh="16px" color={ALMOST_BLACK_FOR_TEXT} mb="6px"
                                    textAlight="left">Пароль</Label>
                                <Box position="relative">
                                    <span onClick={handleTogglePassword} style={{
                                        position: "absolute", top: "16px",
                                        right: "10px", cursor: "pointer"
                                    }}>{showPassword ?
                                        <VisibilityOff />
                                        :
                                        <VisibilityOn />
                                        }</span>
                                    <Input
                                        type={showPassword ? "text" : "password"}
                                        id="password"
                                        name="password"
                                        width="265px" style={{ paddingRight: '35px' }}
                                        {...register("password", {
                                            required: 'Обов\'язкове поле для заповнення',
                                            pattern: {
                                                value: passwordRegex,
                                                message: "Пароль повинен містити не менше 8 символів, 1 літеру, 1 цифру та 1 спеціальний символ"
                                            },
                                        })}
                                        className={errors.password && 'error'}
                                    />
                                </Box>
                                <Box color="red" textAlight="left" border="red" fz="13px" width='300px'
                                    height="28px">{errors?.password && <>{errors?.password?.message || 'Error!'}</>}</Box>
                                <Label htmlFor="password2" lh="16px" color={ALMOST_BLACK_FOR_TEXT} mt="4px"
                                    mb="6px" textAlight="left">Повторити пароль</Label>
                                <Box position="relative">
                                    <span onClick={handleToggleConfirmPassword} style={{
                                        position: "absolute", top: "16px",
                                        right: "10px", cursor: "pointer"
                                    }}>{showConfirmPassword ?
                                        <VisibilityOff />
                                        :
                                        <VisibilityOn />
                                        }</span>
                                    <Input
                                        type={showConfirmPassword ? "text" : "password"}
                                        id="password2"
                                        name="password2"
                                        width="265px" style={{ paddingRight: '35px' }}
                                        {...register("password2", {
                                            required: 'Обов\'язкове поле для заповнення',
                                            validate: (val: string) => {
                                                if (watch('password') != val) {
                                                    return "Паролі не співпадають";
                                                }
                                            }
                                        })}
                                        className={errors.password2 && 'error'} />
                                </Box>
                                <Box color="red" textAlight="left" border="red" fz="13px"
                                    height="14px">{errors?.password2 && <>{errors?.password2?.message || 'Error!'}</>}</Box>
                            </Box>
                        </Box>

                        {registerError &&
                            <Box display="flex" justifyContent="center" m="10px 0">
                                <Typography as="p" textAlight="center" color={ALERT_1}>{registerError}</Typography>
                            </Box>
                        }

                        <Box display="flex" justifyContent="center">
                            <Button type="submit" disabled={!isValid || isLoading} width="204px" mt="6px"
                                primary>Зареєструватись</Button>
                        </Box>
                    </Form>
                </Box>
            </Box>
        </Container>
    )
}

export default RegisterPage;