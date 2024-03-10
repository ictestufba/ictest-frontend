import { Input, Space } from 'antd';
import { SearchProps } from 'antd/es/input';
import styles from "./styles.module.css";

const { Search } = Input;

type props = {
  placeholder?: string;
  onChange:SearchProps['onChange'];
  onSearch?:SearchProps['onSearch'];
};

export function SearchBar({ placeholder, onChange, onSearch }:props) {
  return (
    <Space direction="vertical" className={styles.container}>
      <Search placeholder={placeholder} allowClear onChange={onChange} onSearch={onSearch} className={styles.search}/>
    </Space>
  );
};