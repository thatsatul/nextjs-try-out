interface InputFormProps {
    label: string;
    fieldName: string;
}

const InputForm: React.FC<InputFormProps> = ({ label, fieldName }) => {
    return (
        <form>
            <label htmlFor={fieldName}>{label}</label>
            <input type="text" id={fieldName} name={fieldName} />
        </form>
    );
}
export default InputForm;
