import { Field, Form, Formik } from "formik";
interface Props {
    setNewGrid: (e: string) => void
}
export const Options: React.FC<Props> = ({ setNewGrid }) => {
    return <div className="option wrapper flex flex-col items-center w-full h-full pt-[7.75rem] px-8">
        <Formik
            initialValues={{ letters: "", maxLetters: 8 }}
            onSubmit={e => {
                setNewGrid(e.letters);
            }}>
            <Form className="input-wrapper w-full">
                <label htmlFor="hi" className="block text-gray-200 font-medium mb-2">Letters</label>
                <Field
                    id="hi"
                    name="letters"
                    placeholder="Enter The Letters eg. (AQWNEOAIMYAIGZJHFOVALPAAM)"
                    className="shadow appearance-none border rounded w-full mb-6 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
                />


                <label htmlFor="max-letters" className="block text-gray-200 font-medium mb-2">Max Letters</label>
                <Field
                    type="number"
                    id="max-letters"
                    name="maxLetters"
                    placeholder=""
                    className="shadow appearance-none border rounded mb-6 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
                />
                <br />
                <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md">Submit</button>
            </Form>



        </Formik>
    </div>;
};
