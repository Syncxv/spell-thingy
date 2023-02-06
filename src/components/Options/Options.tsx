import { Field, Form, Formik } from "formik";
import { useContext } from "react";

import { GridManagerContext } from "../../context/GridContext";
interface Props {
    onSubmit: (e: initalValues) => void
}

export interface initalValues { letters: string, maxLetters: number }

export const Options: React.FC<Props> = ({ onSubmit }) => {

    const GridManager = useContext(GridManagerContext);
    return <div className="option wrapper w-full h-full pt-[7.75rem] px-8">
        <Formik
            initialValues={{ letters: `${GridManager.getGridAsString()}`, maxLetters: 8 }}
            onSubmit={e => {
                GridManager.setNewGrid(e.letters);
                onSubmit(e);
            }}>
            <Form className="input-wrapper w-full h-full flex flex-col justify-between items-start">
                <div className="hey w-full">
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
                </div>

                <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md">Submit</button>
            </Form>



        </Formik>
    </div>;
};
