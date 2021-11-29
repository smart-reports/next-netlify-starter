import React, { useContext, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { nanoid } from 'nanoid'
import { CREATE_BILL, DELETE_ONE_BILL, DELETE_ONE_LINE_ITEMS, EDIT_BILL, FIND_ONE_BILLS, GET_ALL_BILL, GET_ALL_LINKS_FILES } from '../queries'
import { mongoObjectId } from '../../../utils'
import { useSetState } from '../../../components/hooks/useState'
import { DELETE_ONE_FILE, DELETE_ONE_FILE_MINIO_CLIENT, GET_ALL_FILE_MINIO } from '../../Attachments/queries'
import { useLazyQuery, useMutation, useQuery } from '@apollo/client'
import { ALL_COMPANIES_BY_USER } from '../../Company/queries'
import { GET_ALL_ACCOUNT, GET_ALL_IVA } from '../../graphql/queries'
import { GET_ALL_PRODUCT_BY_ID } from '../../Products/queries'
import { SUPPLIER_FOR_COMPANY } from '../../Supplier/queries'
import { useUser } from '../../Profile'
import { Context } from '../../../context'
import { useFormTools } from '../../../components/hooks/useForm'
import { useRouter } from 'next/router'

export const ClientAddInvoice = ({ idBills }) => {
  console.log(idBills)
  // State
  const { setAlertBox, handleMenu, menu, company } = useContext(Context)
  const [baseHandle, handleSubmit, setForcedData, { dataForm, errorForm, setForcedError }] = useFormTools()
  const [modal, setModal] = useState(true)
  const [isUpload, setUpload] = useState(false)
  const [tags, setTags] = useState([])
  const [nId, setId] = useState(nanoid())
  const today = new Date()
  const dateNow = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate()
  const [billSubTotal, setSubTotal] = useState(0)
  const [Disable, setDisable] = useState(false)
  const [fileBill, setFileBill] = useState([])
  const [saleTax, setSaleTax] = useState(0)
  const [reset, setReset] = useState(false)
  const [files, setFiles] = useState([])
  const ProgressUpload = useSetState(false)
  const countProgress = useSetState(0)
  const isEdit = useSetState(false)
  const location = useRouter()
  const [showLateral, setShowLateral] = useState(false)
  const router = useRouter()
  // queries
  const [dataUser] = useUser()
  const [getOneBillById, { data: dataOneBill }] = useLazyQuery(FIND_ONE_BILLS, { variables: { id: idBills || null }, fetchPolicy: 'cache-and-network' })
  const [getSuppliersForCompany, { data: dataSupplier }] = useLazyQuery(SUPPLIER_FOR_COMPANY, { variables: { idC: company.idLasComp ? company.idLasComp : dataUser?.lastCompany }, fetchPolicy: 'cache-and-network' })
  const [getAllAccount, { data: dataAccount }] = useLazyQuery(GET_ALL_ACCOUNT, { variables: { idComp: company.idLasComp ? company.idLasComp : dataUser?.lastCompany }, fetchPolicy: 'cache-and-network' })
  const [getProductsForCompany, { data: dataProducts }] = useLazyQuery(GET_ALL_PRODUCT_BY_ID, { variables: { idComp: company.idLasComp ? company.idLasComp : dataUser?.lastCompany }, fetchPolicy: 'cache-and-network' })
  const [getAllIva, { data: dataIva }] = useLazyQuery(GET_ALL_IVA, { variables: { idComp: company.idLasComp ? company.idLasComp : dataUser?.lastCompany }, fetchPolicy: 'cache-and-network' })
  const [createBillMutation, { loading, error }] = useMutation(CREATE_BILL)
  const [deleteOneLineItem] = useMutation(DELETE_ONE_LINE_ITEMS)
  const [updateBill, { loading: loadingUpdate, error: errorUpdate }] = useMutation(EDIT_BILL)
  const [DeleteOneBill] = useMutation(DELETE_ONE_BILL)
  const [deleteOneFileMinio] = useMutation(DELETE_ONE_FILE_MINIO_CLIENT)
  const [getAllBill, { data: dataBill, loading: loadingBills }] = useLazyQuery(GET_ALL_BILL, { variables: { idComp: company.idLasComp ? company.idLasComp : dataUser?.lastCompany }, fetchPolicy: navigator.onLine ? 'network-only' : 'cache-only' })
  const { data: datCompany, loading: LoadingCompany } = useQuery(ALL_COMPANIES_BY_USER)
  // Handles
  console.log(dataOneBill)
  const FileNameLink = useSetState()
  const [getAllFilesLinkToBills, { data: dataLink }] = useLazyQuery(GET_ALL_LINKS_FILES, { variables: { fileName: FileNameLink.state ? FileNameLink.state : null }, fetchPolicy: 'cache-and-network' })
  const [getAllFilesToBills, { data: dataFiles, loading: loadingDeleteFile }] = useLazyQuery(GET_ALL_FILE_MINIO, {
    variables: { IdBills: dataBill ? dataForm.idBill : null },
    update (cache) {
      cache.modify({
        fields: {
          getAllBill (dataOld = []) {
            return cache.writeQuery({ query: GET_ALL_BILL, data: dataOld })
          }
        }
      })
      cache.modify({
        fields: {
          getAllFilesToBills (dataOld = []) {
            return cache.writeQuery({ query: GET_ALL_FILE_MINIO, data: dataOld })
          }
        }
      })
    }
  })
  const [DeleteOneFile] = useMutation(DELETE_ONE_FILE, {
    update (cache) {
      cache.modify({
        fields: {
          getAllFilesToBills (dataOld = []) {
            return cache.writeQuery({ query: GET_ALL_FILE_MINIO, data: dataOld })
          }
        }
      })
    }
  })

  const getFileUrl = async (fileName) => {
    const { BillLink, Delete, idFile } = fileName
    if (!Delete) {
      FileNameLink.setState(BillLink)
      getAllFilesLinkToBills()
      const link = dataLink && dataLink?.getAllFilesLinkToBills?.message
      if (link) {
        window.open(link)
      }
    } else {
      await deleteOneFileMinio({
        variables: { fileName: BillLink },
        update (cache) {
          cache.modify({
            fields: {
              getAllFilesToBills (dataOld = []) {
                return cache.writeQuery({ query: GET_ALL_FILE_MINIO, data: dataOld })
              }
            }
          })
        }
      })
      await DeleteOneFile({
        variables: { id: idFile },
        update (cache) {
          cache.modify({
            fields: {
              getAllFilesToBills (dataOld = []) {
                return cache.writeQuery({ query: GET_ALL_FILE_MINIO, data: dataOld })
              }
            }
          })
        }
      })
    }
  }
  const handleDelete = async (elem) => {
    const { _id } = elem
    const results = await DeleteOneBill({
      variables: { id: _id },
      update (cache) {
        cache.modify({
          fields: {
            getAllBill (dataOld = []) {
              return cache.writeQuery({ query: GET_ALL_BILL, data: dataOld })
            }
          }
        })
      }
    }).catch(err => setAlertBox({ message: `${err}`, duration: 8000 }))
    if (results) setAlertBox({ message: 'successfully removed', duration: 8000, color: 'success' })
  }
  const [size, setsize] = useState(0)
  // EFFECT
  useEffect(() => {
    getProductsForCompany()
    getSuppliersForCompany()
    getAllAccount()
    getAllAccount()
    getAllBill()
    getAllIva()
  }, [company.idLasComp])
  useEffect(() => {
    getAllFilesLinkToBills()
    getAllFilesToBills()
  }, [dataBill, dataForm])
  useEffect(() => {
    const size = Array.from(fileBill).map(x => {
      const array = x.size
      return parseInt(array)
    })
    let totalSize = 0
    for (const i of size) {
      totalSize += i
      setsize(totalSize += i)
    }
    // 1M = 1048576 Bytes
    if (totalSize >= 20971520) return setAlertBox({ message: 'The minimum weight is 20MB', duration: 8000, color: 'warning' })
  }, [fileBill, setFileBill, size, setsize, setFiles])
  const calculateAmount = (quantity, rate) => {
    const quantityNumber = parseFloat(quantity)
    const rateNumber = parseFloat(rate)
    const amount = quantityNumber && rateNumber ? quantityNumber * rateNumber : 0
    return amount
  }
  useEffect(() => {
    let billSubTotal = 0
    dataForm?.items?.forEach((items) => {
      const quantityNumber = parseFloat(items.quantity)
      const rateNumber = parseFloat(items.rate)
      const amount = quantityNumber && rateNumber ? quantityNumber * rateNumber : 0
      billSubTotal += amount.toFixed(2)
    })
    setSubTotal(billSubTotal)
  }, [dataForm])
  const [setTotalIva, setCalTotalIva] = useState(0)
  useEffect(() => {
    let total = 0
    dataForm?.items?.forEach((items) => {
      const totalIva = parseFloat(items.iPercentage)
      total += totalIva.toFixed(2)
    })
    setCalTotalIva(total)
  }, [dataForm])
  const calculateIva = (quantity, rate, iPercentage) => {
    const PercentageNumber = parseInt(iPercentage)
    const quantityNumber = parseFloat(quantity)
    const rateNumber = parseFloat(rate)
    const SubTotal = quantityNumber && rateNumber ? quantityNumber * rateNumber : 0
    const CALC_IVA = SubTotal ? SubTotal / (100 + PercentageNumber) * PercentageNumber : 0
    return !!CALC_IVA && CALC_IVA.toFixed(2)
  }
  useEffect(() => {
    const taxRate = 0
    const saleTax = billSubTotal ? (billSubTotal * taxRate) / 100 : 0
    setSaleTax(saleTax)
  }, [billSubTotal])

  const HandleClickEdit = (item) => {
    // create func
    if (item.view === 1) {
      setModal(true)
      setDisable(true)
      // edit func
    } else if (item.view === 2) {
      setModal(true)
      isEdit.setState(true)
      setDisable(false)
      // id = item._id
      // View func
    } else if (item.view === 3) {
      isEdit.setState(true)
      setShowLateral(true)
    }
    // const Tags = item?.tags?.map(x => x)
    // setTags([Tags.TName])
    setForcedData({
      idBill: item._id,
      // tags: item?.tags?.map(x => ({ TName: x.TName[] })),
      bDescription: item.bDescription,
      billNo: item.billNo,
      refCode: item.bInvoiceRef,
      bDueDate: item.bDueDate,
      _id: item?.idSupplier?._id,
      items: item?.lineItems?.map(x => { return { id: x._id, bDescription: x.description, quantity: parseInt(x.quantity), idAccount: x.idAccount, idRef: x.idPro, rate: parseInt(x.rate), iPercentage: x.iva[0].iPercentage } })
    })
  }

  // getOne Bills
  const getDataOneBill = dataOneBill?.getOneBillById
  useEffect(() => {
    getOneBillById()
    // isEdit.setState(!isEdit.state)
    setForcedData({
      _id: getDataOneBill?.idSupplier?._id,
      idBill: getDataOneBill?._id,
      bDescription: getDataOneBill?.bDescription,
      billNo: getDataOneBill?.billNo,
      refCode: getDataOneBill?.bInvoiceRef,
      bDueDate: getDataOneBill?.bDueDate,
      items: getDataOneBill?.lineItems?.map(x => { return { id: x._id, bDescription: x.description, quantity: parseInt(x.quantity), idAccount: x.idAccount, idRef: x.idPro, rate: parseInt(x.rate), iPercentage: x.iva[0].iPercentage } })

    })
  }, [router.query.id, getDataOneBill])
  const selectedTags = (tags) => {
    setTags(tags)
  }
  const handleFileChange = async (paramFiles) => {
    const files = paramFiles
    setFileBill(files)
    setFiles(paramFiles)
  }


  // MOVER LOS FUNCIONES DE UPLOAD - TODO DE MINIO A OTRA ARCHIVO Y IMPORTAR POR ACA - QUIERP VER LA PARTE DE ARCHIVOS 100% REUSABLE........EN UN FUNCTION QUE RECIBE - NOMBRE DE BUCKET ETC

  const upload = () => {
    const files = fileBill
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      setFileBill(file)
      // Retrieve a URL from our server.
      retrieveNewURL(file, (file, url) => {
        // Upload the file to the server.
        uploadFile(file, url)
      })
    }
  }
  function retrieveNewURL (file, cb) {
    fetch(`/api/presignedUrl?name=${file.name + dataForm?.refCode}`).then((response) => {
      response.text().then((url) => {
        cb(file, url)
      })
    }).catch((e) => {
      console.error(e)
    })
  }
  function uploadFile (file, url) {
    fetch(url, {
      method: 'PUT',
      body: file
    }).then((res) => {
      countProgress.setState(res)
      setUpload(true)
    }).catch((e) => {
      console.error(e)
    })
  }
  const IdMongo = useSetState()
  useEffect(() => {
    const mongoId = mongoObjectId()
    IdMongo.setState(mongoId)
  }, [])
  const newFiles = Array.from(fileBill).map(x => ({ filename: x.name, aSize: x.size, mimetype: x.type }))
  // const arrayData = newFiles.concat([1, 2, 3, 4, 5])
  const newTags = tags?.map(x => ({ TName: x }))
  const newData = dataForm?.items?.map(x => ({ _id: x.id, description: x.bDescription, quantity: parseInt(x.quantity), idPro: x.idRef, idAccount: x.idAccount, rate: parseInt(x.rate), setDataIva: [{ iPercentage: x.iPercentage }] }))
  const total = parseInt(billSubTotal + saleTax)
  const handleForm = (e, show) => handleSubmit({
    event: e,
    action: () => {
      if (show === 1) {
        upload()
        location.replace(location.pathname)
        setReset(true)
        return createBillMutation({
          variables: {
            input: {
              bInvoiceRef: dataForm?.refCode,
              bDescription: dataForm.bDescription,
              idComp: company.idLasComp ? company.idLasComp : dataUser?.lastCompany,
              bInvoiceDate: dateNow,
              bDueDate: dataForm.bDueDate,
              idSupplier: dataForm._id,
              billNo: parseInt(dataForm.billNo),
              billSubTotal: parseInt(billSubTotal),
              billSubVATTotal: parseInt(billVATTotal),
              billTotal: total,
              idFiles: IdMongo.state
            },
            //  Array
            inputLineItems: {
              setData: newData
            },
            //  Array Tags
            setTagsInput: {
              setTags: newTags
            },
            setFilesInput: {
              idFiles: IdMongo.state,
              filesData: newFiles
            }
          },
          update: (cache, { data: { getDataAllById } }) => updateCacheMod({
            cache,
            query: GET_ALL_BILL,
            nameFun: 'getAllBill',
            dataNew: getDataAllById,
            type: 2

          })
        })
      } else if (show === 2) {
        location.replace(location.pathname)
        setReset(true)

        return updateBill({
          variables: {
            input: {
              _id: dataForm.idBill,
              bInvoiceRef: dataForm?.refCode,
              bDescription: dataForm.bDescription,
              idComp: company.idLasComp ? company.idLasComp : dataUser?.lastCompany,
              bInvoiceDate: dateNow,
              idSupplier: dataForm._id,
              billNo: parseInt(dataForm.billNo),
              bDueDate: dataForm.bDueDate,
              billSubTotal: billSubTotal,
              billVATTotal: billVATTotal,
              billTotal: total
            },
            // Array
            inputLineItems: {
              setData: newData
            },
            // // Array Tags
            // setTagsInput: {
            //   setTags: newTags
            // },
            setFilesInput: {
              filesData: newFiles
            }
          },
          update: (cache, { data: { getDataAllById } }) => updateCacheMod({
            cache,
            query: GET_ALL_BILL,
            nameFun: 'getAllBill',
            dataNew: getDataAllById,
            type: 2

          })
        })
      } else if (show === 3) {
        return null
      }
    },
    actionAfterSuccess: () => {
      setModal(!modal)
      setReset(true)
      setForcedData({
        items: [{
          select: false,
          id: 0,
          bDescription: '',
          quantity: '',
          rate: ''
        }],
        billNo: Math.round(Math.random() * (99999 - 10000) + 10000),
        refCode: `${nanoid()}`,
        dateNow: `${dateNow}`
      })
    }
  })

  useEffect(() => {
    setForcedData({
      items: [{
        select: false,
        id: 0,
        bDescription: '',
        quantity: '',
        rate: ''

      }],
      billNo: Math.round(Math.random() * (99999 - 10000) + 10000),
      refCode: `${nanoid()}`,
      dateNow: `${dateNow}`
    })
  }, [])

  const addMore = (type, key) => {
    setForcedData({
      ...dataForm,
      [type]: [...dataForm?.[type], { [key]: dataForm?.[type]?.length }]
    })
  }
  // Onchange for all
  const handleChange = (e, error, item = {}) => {
    setForcedError({ ...errorForm, [e.target.name]: error })

    const { type, key, id, obj } = item
    if (!type) {
      setForcedData({ ...dataForm, [e.target.name]: e.target.value })
    }
    if (obj) {
      setForcedData({ ...dataForm, [obj]: { ...dataForm[obj], [e.target.name]: e.target.value } })
    }
    if (type) {
      setForcedData({
        ...dataForm, [type]: dataForm?.[type].map(x => (x[key] === id || x.id === id) ? { ...x, [e.target.name]: e.target.value } : x)
      })
    }
  }
  const deleteSlot = async slot => {
    const { id, key, type } = slot || {}
    setForcedData({
      ...dataForm,
      [type]: dataForm[type].filter(e => e.id !== id && e).map(x => (x[key[0]] === id ? { ...x, [key[1]]: 0 } : x))
    })
    if (typeof id === 'string') {
      await deleteOneLineItem({
        variables: { idLine: id, id: dataForm.idBill },
        update (cache) {
          cache.modify({
            fields: {
              getAllBill (dataOld = []) {
                return cache.writeQuery({ query: GET_ALL_BILL, data: dataOld })
              }
            }
          })
        }
      }).catch(() => console.log(''))
    }
  }

  const DeleteAll = () => {
    setForcedData({
      items: [{
        id: 0,
        bDescription: '',
        quantity: '',
        rate: ''
      }],
      billNo: Math.round(Math.random() * (99999 - 10000) + 10000),
      refCode: `${nanoid()}`,
      dateNow: `${dateNow}`
    })
  }

  return (
        <div>

        </div>
  )
}

ClientAddInvoice.propTypes = {

}
