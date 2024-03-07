import { finished } from "stream";

enum StyleOptions {
    "bold",
    "underline",
    "italic"
}

interface InputFormat {
    id: string;
    text: string;
    style?: StyleOptions[];
}

interface StyleFormat {
    style: StyleOptions[];
    range: string;
}

interface OutputFormat {
    id: string;
    text: string;
    styling: StyleFormat[];
}



const toRangedStyleFormat = (inputList: InputFormat[]) => {
    
    let output: OutputFormat = {
        id: 'a',
        text: '',
        styling: []
    };
    
    // simply tranform the format
    inputList.forEach(value => {
        if (value.style) {
            const start = output.text.length;
            const finish = output.text.length + value.text.length;
            output.styling.push({style: value.style, range: `${start}-${finish}`});
        }
        output.text += value.text;
    });

    let optimised: OutputFormat = {
        id: output.id,
        text: output.text,
        styling: []
    };

    // optimise
    // go backwards and remove styles if the previous entry also had the same styles
    let last: StyleFormat | undefined;
    for (let index = output.styling.length; index > 0 ; index--) {
        const value = output.styling[index - 1];
        if (value.style) {
            if (!last) {
                last = value;
                optimised.styling.push(value);
            }
            else 
                last.style.forEach(style => {
                    if (value.style?.includes(style)) {
                        let newVal:StyleOptions[] = [];
                        if (Array.isArray(value.style))
                            value.style?.forEach(v => {if (v != style) newVal.push(v);});
                        else
                            newVal = [value.style];
                        
                        value.style = newVal;
                        optimised.styling.push(value);
                    }
                });
        }
    }

    return output;
}

const testCase1 = [
    {"id": "1", "text": "I accept the "},
    {"id": "2", "text": "terms and conditions", "style": "underline"},
    {"id": "3", "text": "."}
  ] as InputFormat[];

  const testCase2 = [
    {"id": "1", "text": "This is "},
    {"id": "2", "text": "bold", "style": "bold"},
    {"id": "3", "text": " and "},
    {"id": "4", "text": "italic", "style": "italic"},
    {"id": "5", "text": " text.", "style": ["bold", "italic"]}
  ] as InputFormat[];

  console.info(JSON.stringify(toRangedStyleFormat(testCase2)));