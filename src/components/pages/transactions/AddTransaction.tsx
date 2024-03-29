import { useEffect, useState } from 'react';
import { mockWallets } from "../../../../mock-data/wallets";
import { isDev } from "../../../consts/consts";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { Box } from "../../atoms/box/Box.styled";
import { Button } from "../../atoms/button/Button.styled";
import { Input } from "../../atoms/input/Input.styled";
import { Label } from "../../atoms/label/Label.styled";
import { List } from "../../atoms/list/List.styled";
import { ListItem } from "../../atoms/list/ListItem.styled";
import Select from "../../molecules/select/Select";
import { Typography } from "../../atoms/typography/Typography.styled";
import TabSwitch, { ISwitchButton } from "../../molecules/tabs/switch/TabSwitch";
import Wallet from "../../molecules/wallet/Wallet";
import { BASE_2, WHITE } from "../../../shared/styles/variables";
import { IWallet } from "../../../store/types";

import {
  setActiveTransaction,
  setAddTransactionData,
  transactionAction
} from "../../../store/transactionSlice";

import { formatTransactionDateToUTC } from '../../../shared/utils/formatTransactionDate';
import { userId } from '../../../api/api';
import { getFilteredCategories } from '../../../store/categorySlice';
import DatePicker from './DatePicker';
import { Form } from '../../atoms/form/Form.styled';
import { moneyAmountRegex, titleRegex, twoSymbolsRegex } from '../../../shared/utils/regexes';
import { useForm } from 'react-hook-form';

const AddTransaction: React.FC = () => {
  const dispatch = useAppDispatch()

  const { addTransactionData, isLoading } = useAppSelector(state => state.transaction);
  const { categories } = useAppSelector(state => state.category);
  const { wallets } = useAppSelector(state => state.wallet);
  const { user } = useAppSelector(state => state.user);

  const selectedCategory = categories.all.find((c) => c.id === addTransactionData?.category)

  const [selectedCategoryValues, setSelectedCategoryValues] = useState<
    { value: number, label: string }
  >({
    value: selectedCategory?.id,
    label: selectedCategory?.title,
  });

  const options: any = (addTransactionData?.type_of_outlay === "expense"
    ? categories.expense
    : categories.income
  )?.map(({ id, title }) => {
    return { value: id, label: title }
  })

  const isValid = Object.keys(addTransactionData || {})?.length >= 4;

  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
    getValues,
    clearErrors,
  } = useForm({ mode: "all" });

  const switchButtons: ISwitchButton[] = [
    {
      buttonName: 'Витрата',
      onTabClick: () => {
        if (addTransactionData?.type_of_outlay === "expense") return;
        dispatch(setAddTransactionData({
          type_of_outlay: "expense",
          category: categories.expense[0]?.id
        }));
        setSelectedCategoryValues({
          value: categories.expense[0]?.id,
          label: categories.expense[0]?.title
        })
      },
      isActive: addTransactionData?.type_of_outlay === "expense"
    },
    {
      buttonName: 'Надходження',
      onTabClick: () => {
        if (addTransactionData?.type_of_outlay === "income") return;
        dispatch(setAddTransactionData({
          type_of_outlay: "income",
          category: categories.income[0]?.id
        }));
        setSelectedCategoryValues({
          value: categories.income[0]?.id,
          label: categories.income[0]?.title
        })
      },
      isActive: addTransactionData?.type_of_outlay === "income"
    },
  ];

  useEffect(() => {
    clearErrors('category');
    setValue('category', addTransactionData?.category);
  }, [addTransactionData?.category]);

  useEffect(() => {
    dispatch(getFilteredCategories("?type_of_outlay=income"))
    dispatch(getFilteredCategories("?type_of_outlay=expense"))

    dispatch(setAddTransactionData({
      created: formatTransactionDateToUTC(new Date()),
      type_of_outlay: "expense",
      category: categories.expense[0]?.id
    }))
  }, []);

  useEffect(() => {
    setSelectedCategoryValues({
      value: categories.expense[0]?.id,
      label: categories.expense[0]?.title
    })
    dispatch(setAddTransactionData({
      created: formatTransactionDateToUTC(new Date()),
      type_of_outlay: "expense",
      category: categories.expense[0]?.id
    }))
    setValue('category', selectedCategoryValues)
  }, [categories.expense]);

  function onWalletClick(wallet: IWallet) {
    dispatch(setAddTransactionData({ wallet: wallet.id }));
  };

  function onCategoryChange(selectedValue: any): void {
    dispatch(setAddTransactionData({ category: selectedValue?.value }));
    setSelectedCategoryValues({
      value: selectedValue?.value,
      label: selectedValue?.label
    });
  }

  function handleSub(data: { amount: string, category: number, title?: string }) {
    let transactionTitle;

    if (!getValues('title')) {
      transactionTitle = "New transaction";
    } else {
      transactionTitle = data.title;
    }

    dispatch(setActiveTransaction(null));
    dispatch(transactionAction({
      data: {
        ...addTransactionData,
        amount_of_funds: data?.amount,
        owner: user?.id || userId,
        title: transactionTitle
      },
      method: "POST"
    }))
  }

  return (
    <Box display="flex" direction="column" width="555px">
      <Typography
        as="h2"
        fw="600"
        fz="22px"
        mt="5px"
        mb="30px"
      >
        Додати транзакцію
      </Typography>
      <Box overflow='auto' height="100px" bgColor={BASE_2} borderRadius="16px" grow="1" p="15px">
        <Box mb="20px">
          <Typography
            as="h3"
            fz="16px"
            fw="500"
            mb="12px"
          >
            Тип транзакції
          </Typography>
          <TabSwitch switchButtons={switchButtons} />
        </Box>
        <Box mb="20px">
          <Typography
            as="h3"
            fz="16px"
            fw="500"
            mb="12px"
          >
            Час транзакції
          </Typography>
          <DatePicker isEditTrapsactionOpen={false} />
        </Box>
        <Box mb="20px">
          <Typography as="h3" fz="16px" fw="500" mb="12px">
            Рахунок
          </Typography>
          <Box display="flex" wrap="wrap" gap="8px">
            {wallets?.map((wallet, index) => (
              <ListItem key={index} flex="1 1 240px">
                <Wallet
                  wallet={wallet}
                  onWalletClick={() => onWalletClick(wallet)}
                  isActive={addTransactionData?.wallet === wallet.id}
                />
              </ListItem>
            ))}
          </Box>
        </Box>
        <Form onSubmit={handleSubmit(handleSub)}>
          <Box mb="20px">
            <Label fw="500" mb="12px">Категорія</Label>
            <Select
              value={selectedCategoryValues}
              options={options}
              onCategoryChange={onCategoryChange}
              {...register('category', {
                required: 'Обов\'язкове поле для заповнення',
              })}
              isError={errors?.category}
            />
            <Box
              color="red"
              textAlight="left"
              border="red"
              fz="13px"
              height="14px"
              m="0 0 20px 0"
            >
              {errors?.category && <>{errors?.category?.message || 'Error!'}</>}
            </Box>
          </Box>
          <Box mb="25px">
            <Label fw="500" htmlFor="title" mb="12px">
              Деталі (не обовʼязково)
            </Label>
            <Input
              type="text"
              id="title"
              width="93%"
              bgColor={WHITE}
              className={errors?.title && 'error'}
              maxLength={50}
              {...register('title', {
                validate: {
                  hasTwoSymbols: (value) => {
                    if (!value) {
                      clearErrors('title');
                      return;
                    };
                    return twoSymbolsRegex.test(value) || 'Повинно бути не менше 2 символів';
                  },
                  hasTwoLetters: (value) => {
                    if (!value) {
                      clearErrors('title');
                      return;
                    };
                    return titleRegex.test(value) || 'Повинно бути не менше 2 літер';
                  },
                }
              })}
            />
            <Box
              color="red"
              textAlight="left"
              border="red"
              fz="13px"
              height="14px"
              m="0 0 20px 0"
            >
              {errors?.title && <>{errors?.title?.message || 'Error!'}</>}
            </Box>
          </Box>
          <Box mb="20px">
            <Label fw="500" htmlFor="amount" mb="12px">
              Сума
            </Label>
            <Input
              type="text"
              inputMode="numeric"
              style={{ fontSize: "19px", fontWeight: "600" }}
              height='25px'
              id="amount"
              width="225px"
              bgColor={WHITE}
              {...register('amount', {
                required: 'Обов\'язкове поле для заповнення',
                pattern: {
                  value: moneyAmountRegex,
                  message: 'Сума може бути від 1 до 8 цифр перед крапкою та до 2 цифр після крапки',
                },
                min: {
                  value: 0.00,
                  message: 'Сума може бути додатньою від 1 до 8 цифр перед крапкою та до 2 цифр після крапки',
                },
              })}
              className={errors.amount && 'error'}
            />
            <Box
              color="red"
              textAlight="left"
              border="red"
              fz="13px"
              height="14px"
              m="0 0 20px 0"
            >
              {errors?.amount && <>{errors?.amount?.message || 'Error!'}</>}
            </Box>
          </Box>
          <Box>
            <Button
              primary
              width="100%"
              type="submit"
              disabled={!isValid || !!errors?.amount || isLoading}
            >
              Зберегти
            </Button>
          </Box>
        </Form>
      </Box>
    </Box>
  );
}

export default AddTransaction;