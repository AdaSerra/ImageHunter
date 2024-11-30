import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import { Checkbox, Divider, Slider, Switch, Radio, Button, ConfigProvider, message } from 'antd';
import { defaultOption, getOption, searchEngines } from './utils/storage.js'

const units = ["Bytes", "Kilobytes", "Megabytes"];

//main component for options page


const App = () => {

  const [option, setOption] = useState()

  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    async function fetchData() {
      const initialOption = await getOption()
      setOption(initialOption)
    };
    fetchData()

  }, [])

  const handleOption = (value, key) => {
    setOption(prevValue => ({ ...prevValue, [key]: value }))

  }

  const saveOption = () => {
    setOption(option)
    browser.storage.sync.set({ option: JSON.stringify(option) });
    messageApi.open({
      type: 'success',
      content: 'Options Saved',
      className: 'message'

    })
  }

  const resetOption = () => {
    setOption(defaultOption)
    browser.storage.sync.set({ option: JSON.stringify(defaultOption) });
  }




  if (option) {

    return (
      <ConfigProvider
        theme={{
          token: { colorPrimary: "rgb(0,83,222)" }
        }}>
        {contextHolder}
        <h2 className="int">OPTIONS</h2>
        <h3>Filter settings</h3>
        <Extension updateOption={handleOption} def={option.extensions} />
        <SizePixel updateOption={handleOption} width={option.width} height={option.height} />
        <SizeBytes updateOption={handleOption} size={option.size} />
        <Divider />
        <h3>Reverse search engine options</h3>
        <SearchEngine updateOption={handleOption} engine={option.engine} />
        <Button onClick={saveOption} type="primary" className="int"  >Save </Button>
        <Button onClick={resetOption} type="primary" className="int">Reset</Button>
        <Divider />
        <h3>Note</h3>
        <p>The size in bytes is calculated from the encrypted data if available otherwise from the raw data(*).</p>
        <p>The date in the image description is the last date which resource web contains the image was modified if available or the most recent server response date.
        </p>
        <p>Metadata are avaible only for JPG, AVIF, TIFF, WEBP, PNG file type.</p>
        <br></br>

      </ConfigProvider>
    )

  }
}

//child components

const SizeBytes = ({ updateOption, size }) => {

  const getDefUnit = (size) => {
    return size > 1024 * 1024 ? units[2] : size > 1024 ? units[1] : units[0]
  }

  const getDefSize = (size) => {
    return size > 1024 * 1024 ? size / 1024 / 1024 : size > 1024 ? size / 1024 : size
  }


  const [value, setValue] = useState();
  const [unit, setUnit] = useState();

  useEffect(() => {
    setValue(getDefSize(size))
  }, [size])

  useEffect(() => {
    setUnit(getDefUnit(size))
  }, [size])


  const handleSliderChange = (newValue) => {


    switch (unit) {
      case units[2]:
        updateOption((newValue * 1024 * 1024), "size");
        break;
      case units[1]:
        updateOption(newValue * 1024, "size");
        break;
      default:
        updateOption(newValue, "size")
    }

  }

  const handleRadioChange = (e) => {
    setUnit(e.target.value)
  }

  const assignvalue = (string) => {
    switch (string) {
      case "Bytes":
        return "1 Kb or more";

      case "Kilobytes":
        return "1 Mb or more";

      case "Megabytes":
        return "1 Gb or more";

      default:
        return ""

    }
  }

  let marks = {
    0: {
      style: {
        whiteSpace: "nowrap",
        fontSize: "12px"
      },
      label: "0"
    },

    1024: {
      style: {
        whiteSpace: "nowrap",
        fontSize: "12px"
      },
      label: assignvalue(unit)
    }
  }

  return (
    <><Divider />
      <div className="left">
        <h4 className="option">Size in {unit}</h4>
        <Slider className="customSlider" value={value} onChange={handleSliderChange} step={10} max={1024} marks={marks} />
      </div>
      <div className="left">
        <h4 className="option">Unit</h4>
        <Radio.Group value={unit} onChange={handleRadioChange}>
          <Radio value={units[0]}>{units[0]}</Radio>
          <Radio value={units[1]}>{units[1]}</Radio>
          <Radio value={units[2]}>{units[2]}</Radio>
        </Radio.Group>
      </div>
    </>
  )
}


const SearchEngine = ({ updateOption, engine }) => {

  const handleRadioChange = (e) => {
    updateOption(e.target.value, "engine")

  }

  return (
    <><Divider />
      <div className="left">

        <Radio.Group value={engine} onChange={handleRadioChange} className="left engine">
          {Object.keys(searchEngines).map((item, index) => (
            <Radio key={index} value={item}>{item}</Radio>
          ))}
        </Radio.Group>

      </div>
    </>
  )
}

const SizePixel = ({ updateOption, width, height }) => {

  const [value1, setValue1] = useState(width);
  const [value2, setValue2] = useState(height);
  const [synced, setSynced] = useState(true);

  useEffect(() => {
    setValue1(width)

  }, [width]);
  useEffect(() => {
    setValue2(height)

  }, [height])

  const handleSliderChange1 = (newValue) => {
    if (synced) {

      updateOption(newValue, "width");

      updateOption(newValue, "height")
    }
    else { updateOption(newValue, "width") }
  };

  const handleSliderChange2 = (newValue) => {
    if (synced) {

      updateOption(newValue, "width");

      updateOption(newValue, "height")
    }
    else { updateOption(newValue, "height") }
  };

  const toggleSync = (checked) => {
    setSynced(checked); if (checked) { setValue2(value1); }
  }

  const marks = {
    0: {
      style: { fontSize: "12px" },
      label: "0"
    },
    2500: {
      style: {
        whiteSpace: 'nowrap', fontSize: "12px"
      },
      label: "2500 or more"
    }
  }
  return (
    <>
      <Divider />
      <div className="left">
        <h4 className="option">Width px  </h4>
        <Slider className="customSlider" max={2500} step={20} marks={marks} value={value1} onChange={handleSliderChange1} />
      </div>

      <div className="left">
        <h4 className="option">Height px   </h4>
        <Slider className="customSlider" max={2500} step={20} marks={marks} value={value2} onChange={handleSliderChange2} />
      </div>

      <div className="left">
        <div className="option">Same value  </div><Switch checked={synced} onChange={toggleSync} size="small" />
      </div>




    </>
  )

}



const Extension = ({ updateOption, def }) => {

  const getDefext = (def) => {
    return def.filter(elem => elem !== "ALL")
  }

  const [checkedList, setCheckedList] = useState(getDefext(def));
  useEffect(() => {
    setCheckedList(getDefext(def))
  }, [def])

  const checkAll = getDefext(defaultOption.extensions).length === checkedList.length;
  const indeterminate = checkedList.length > 0 && checkedList.length < defaultOption.extensions.length;

  const onChange = (list) => {
    // setCheckedList(list);
    updateOption(list, "extensions")
  };
  const onCheckAllChange = (e) => {
    // setCheckedList(e.target.checked ? defaultOption.extensions : []);
    updateOption(e.target.checked ? defaultOption.extensions : [], "extensions")
      ;
  };
  return (
    <>
      <div className="left">
        <h4 className="option">Extension</h4>

        <Checkbox indeterminate={indeterminate} onChange={onCheckAllChange} checked={checkAll}>
          Select All
        </Checkbox>
      </div>

      <div className="left">
        <div className="option"></div>
        <Checkbox.Group className="int" options={defaultOption.extensions.slice(1)} value={checkedList} onChange={onChange} />
      </div>

    </>
  );
};

















const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);